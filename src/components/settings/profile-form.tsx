'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2, Mail, CircleAlert } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { SettingsPanelHead } from './settings-panel-head';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

// Rough email shape check — the real validator is Supabase Auth, which
// rejects anything malformed when we call updateUser({ email }). We
// just want to stop obvious typos before making a network call.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileForm() {
  const { user, profile, account, refreshProfile } = useAuth();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const orgFileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  // Organization branding state
  const [orgName, setOrgName] = useState('');
  const [pendingOrgLogo, setPendingOrgLogo] = useState<File | null>(null);
  const [orgPreviewUrl, setOrgPreviewUrl] = useState<string | null>(null);
  const [removeOrgLogo, setRemoveOrgLogo] = useState(false);

  const [saving, setSaving] = useState(false);
  const [emailChangePending, setEmailChangePending] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);

  // Seed form state once the profile loads.
  useEffect(() => {
    if (!profile || !user) return;
    setFullName(profile.full_name ?? '');
    setEmail(profile.email ?? '');
    if (account?.name) {
      setOrgName(account.name);
    }

    async function fetchDepartments() {
      const { data, error } = await supabase
        .from('department_members')
        .select(`
          department_id,
          departments:department_id (name)
        `)
        .eq('user_id', user!.id);

      if (data) {
        const deptNames = data
          .map(d => (d.departments as any)?.name)
          .filter(Boolean) as string[];
        setDepartments(deptNames);
      }
    }
    fetchDepartments();
  }, [profile, user, account]);

  // Cleanup object URLs to avoid leaks.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (orgPreviewUrl) URL.revokeObjectURL(orgPreviewUrl);
    };
  }, [previewUrl, orgPreviewUrl]);

  const currentAvatar =
    previewUrl ?? (!removeAvatar ? profile?.avatar_url ?? null : null);

  const initial = (fullName || profile?.full_name || profile?.email || 'U')
    .charAt(0)
    .toUpperCase();

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // reset so the same file can be re-picked
    if (!file) return;

    if (!ALLOWED_MIME.has(file.type)) {
      toast.error('Unsupported image type', {
        description: 'Use PNG, JPG, WebP, or GIF.',
      });
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error('Image is too large', {
        description: 'Maximum 2 MB.',
      });
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingAvatar(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemoveAvatar(false);
  };

  const onRemoveAvatar = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingAvatar(null);
    setPreviewUrl(null);
    setRemoveAvatar(true);
  };

  const onPickOrgLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (file.size > MAX_AVATAR_BYTES) {
      toast.error('Logo image is too large (Maximum 2 MB)');
      return;
    }

    if (orgPreviewUrl) URL.revokeObjectURL(orgPreviewUrl);
    setPendingOrgLogo(file);
    setOrgPreviewUrl(URL.createObjectURL(file));
    setRemoveOrgLogo(false);
  };

  const onRemoveOrgLogo = () => {
    if (orgPreviewUrl) URL.revokeObjectURL(orgPreviewUrl);
    setPendingOrgLogo(null);
    setOrgPreviewUrl(null);
    setRemoveOrgLogo(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      toast.error('Display name is required');
      return;
    }
    const trimmedEmail = email.trim();
    if (!EMAIL_RE.test(trimmedEmail)) {
      toast.error('Enter a valid email address');
      return;
    }

    setSaving(true);
    try {
      let nextAvatarUrl: string | null = profile.avatar_url ?? null;

      // Upload a newly-staged image, if any.
      if (pendingAvatar) {
        const ext =
          pendingAvatar.name.split('.').pop()?.toLowerCase() || 'png';
        const path = `${user.id}/avatar-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, pendingAvatar, {
            cacheControl: '3600',
            upsert: true,
            contentType: pendingAvatar.type,
          });
        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
        const {
          data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(path);
        nextAvatarUrl = publicUrl;
      } else if (removeAvatar) {
        nextAvatarUrl = null;
      }

      // Upload organization logo if pending
      let nextOrgLogoUrl: string | null = (account as any)?.logo_url ?? null;
      if (pendingOrgLogo && account?.id) {
        const ext = pendingOrgLogo.name.split('.').pop()?.toLowerCase() || 'png';
        const path = `accounts/${account.id}/logo-${Date.now()}.${ext}`;
        const { error: uploadOrgError } = await supabase.storage
          .from('avatars')
          .upload(path, pendingOrgLogo, {
            cacheControl: '3600',
            upsert: true,
            contentType: pendingOrgLogo.type,
          });
        if (!uploadOrgError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from('avatars').getPublicUrl(path);
          nextOrgLogoUrl = publicUrl;
        }
      } else if (removeOrgLogo) {
        nextOrgLogoUrl = null;
      }

      // Update account organization name & logo if changed
      if (account?.id) {
        const trimmedOrg = orgName.trim();
        await supabase
          .from('accounts')
          .update({
            name: trimmedOrg || account.name,
            logo_url: nextOrgLogoUrl,
          })
          .eq('id', account.id);
      }

      // Persist name + avatar to profiles.
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: trimmedName,
          avatar_url: nextAvatarUrl,
        })
        .eq('user_id', user.id);
      if (updateError) {
        throw new Error(`Save failed: ${updateError.message}`);
      }

      // Email change goes through Supabase Auth, which emails a
      // confirmation to both the old and new addresses. We don't
      // touch profiles.email — Supabase will push the change there
      // after the user clicks the link (handled by the handle_new_user
      // trigger pattern in production deployments).
      let emailSent = false;
      if (trimmedEmail.toLowerCase() !== profile.email.toLowerCase()) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: trimmedEmail,
        });
        if (emailError) {
          // Partial success: name/avatar saved but email didn't.
          toast.success('Profile saved');
          toast.error(`Email change failed: ${emailError.message}`);
          setSaving(false);
          await refreshProfile();
          return;
        }
        emailSent = true;
      }

      setEmailChangePending(emailSent);
      setPendingAvatar(null);
      setPreviewUrl(null);
      setRemoveAvatar(false);
      setPendingOrgLogo(null);
      setOrgPreviewUrl(null);
      setRemoveOrgLogo(false);
      await refreshProfile();

      toast.success(
        emailSent
          ? 'Profile saved — check your email to confirm the address change'
          : 'Profile & Organization Branding saved',
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const dirty =
    !!profile &&
    (fullName.trim() !== (profile.full_name ?? '') ||
      email.trim().toLowerCase() !== (profile.email ?? '').toLowerCase() ||
      orgName.trim() !== (account?.name ?? '') ||
      pendingAvatar !== null ||
      removeAvatar ||
      pendingOrgLogo !== null ||
      removeOrgLogo);

  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : '—';

  return (
    <section className="max-w-2xl animate-in fade-in-50 duration-200">
      <SettingsPanelHead
        title="Your profile"
        description="How you show up across the app. Your avatar and name appear in the header, sidebar, and anywhere your teammates see you."
      />
      <form onSubmit={onSubmit} className="space-y-4">
        <Card>
          <CardContent className="space-y-6">
            {/* Avatar row */}
            <div className="flex flex-wrap items-center gap-5">
              <Avatar size="lg" className="size-16">
                {currentAvatar ? (
                  <AvatarImage src={currentAvatar} alt={fullName || 'Avatar'} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-base text-primary">
                  {initial}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={onPickFile}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                >
                  <Upload className="size-4" />
                  {currentAvatar ? 'Change photo' : 'Upload photo'}
                </Button>
                {currentAvatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onRemoveAvatar}
                    disabled={saving}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                )}
                <p className="w-full text-xs text-muted-foreground">
                  PNG, JPG, WebP, or GIF. Up to 2 MB.
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="profile-full-name" className="text-foreground">
                Display name
              </Label>
              <Input
                id="profile-full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
                maxLength={120}
                disabled={saving}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="profile-email" className="text-foreground">
                Email
              </Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving}
                required
              />
              {emailChangePending && (
                <p className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                  <Mail className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    Check the inbox for <strong>{profile?.email}</strong> and{' '}
                    <strong>{email}</strong> — both need to confirm before the
                    change takes effect.
                  </span>
                </p>
              )}
            </div>

            {/* Organization / Workspace Branding Card for Admins */}
            <div className="rounded-xl border border-border/80 bg-card p-4 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    🏢 Organization & Workspace Branding
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Custom logo & company name shown in the sidebar header and client invoices
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 p-1 overflow-hidden shadow-xs">
                  {orgPreviewUrl || account?.logo_url ? (
                    <img 
                      src={orgPreviewUrl || account?.logo_url || '/logo.svg'} 
                      alt="Organization Logo" 
                      className="h-full w-full rounded-lg object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.png'
                      }}
                    />
                  ) : (
                    <img 
                      src="/logo.svg" 
                      alt="AIWCRM Logo" 
                      className="h-full w-full rounded-lg object-contain"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <input
                    ref={orgFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={onPickOrgLogo}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => orgFileInputRef.current?.click()}
                    disabled={saving}
                    className="text-xs font-bold h-8 cursor-pointer"
                  >
                    <Upload className="size-3.5 mr-1" />
                    {account?.logo_url || orgPreviewUrl ? 'Change Org Logo' : 'Upload Org Logo'}
                  </Button>
                  {(account?.logo_url || orgPreviewUrl) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onRemoveOrgLogo}
                      disabled={saving}
                      className="text-xs text-muted-foreground hover:text-rose-500 h-8 cursor-pointer"
                    >
                      <Trash2 className="size-3.5 mr-1" />
                      Reset to Default AIWCRM Logo
                    </Button>
                  )}
                  <p className="w-full text-[10.5px] text-muted-foreground">
                    PNG, SVG, JPG. Replaces default logo across sidebar and workspace headers.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <Label htmlFor="org-name" className="text-xs font-bold text-foreground">
                  Organization / Company Name
                </Label>
                <Input
                  id="org-name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Nighwan Tech / AIWCRM Enterprise"
                  disabled={saving}
                  className="h-9 text-xs font-bold"
                />
              </div>
            </div>

            {/* Read-only block */}
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account details
              </p>
              <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="mt-0.5 font-mono text-foreground">
                    {profile?.role ?? 'user'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Joined</dt>
                  <dd className="mt-0.5 text-foreground">{joined}</dd>
                </div>
                {departments.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Departments</dt>
                    <dd className="mt-0.5 text-foreground">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {departments.map((dept, i) => (
                          <span key={i} className="text-[10px] uppercase font-semibold h-5 px-2 whitespace-nowrap bg-primary/10 text-primary border border-primary/20 rounded-full inline-flex items-center">
                            {dept}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">User ID</dt>
                  <dd className="mt-0.5 break-all font-mono text-xs text-muted-foreground">
                    {user?.id ?? '—'}
                  </dd>
                </div>
              </dl>
            </div>

            {!profile && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CircleAlert className="size-4" />
                Loading your profile…
              </p>
            )}

          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving || !dirty || !profile} className="cursor-pointer">
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1.5" />
                Saving…
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
