/**
 * Figma `19-team` — Team Management: member cards (48px avatar with online dot,
 * name + role badge, trailing more-horizontal action sheet) + Add member FAB.
 *
 * The project has no team/roles service (src/services only covers auth, sync,
 * inventory, notifications, AI and import/export), so members use the spec's
 * mock copy and all actions are informational — no fake API calls.
 */
import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { MoreHorizontal, Plus, User } from 'lucide-react-native';
import { Screen } from '../src/components/Screen';
import { BottomTabBar } from '../src/components/TabBar';
import { Badge, Fab, ScreenHeader, Txt, Type } from '../src/components/ui';
import { useTheme } from '../src/hooks/useTheme';

type Role = 'Owner' | 'Admin' | 'Manager' | 'Staff' | 'Viewer';

type Member = { id: string; name: string; role: Role; online: boolean };

const MEMBERS: Member[] = [
  { id: 'member_sarah', name: 'Sarah Chen', role: 'Owner', online: true },
  { id: 'member_mike', name: 'Mike Johnson', role: 'Admin', online: true },
  { id: 'member_lisa', name: 'Lisa Park', role: 'Manager', online: false },
  { id: 'member_tom', name: 'Tom Wilson', role: 'Staff', online: true },
  { id: 'member_anna', name: 'Anna Garcia', role: 'Viewer', online: false },
];

const ROLE_ACCESS: Record<Role, string> = {
  Owner: 'Full control of the workspace: members, settings, billing and all inventory data.',
  Admin: 'Manages members, settings and all inventory data.',
  Manager: 'Manages inventory, categories, locations and reports.',
  Staff: 'Adds and updates items; cannot manage members or settings.',
  Viewer: 'Read-only access to inventory and reports.',
};

const NOT_CONNECTED = 'Team administration is not connected to a backend in this build, so no changes were made.';

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function MemberCard({ member }: { member: Member }) {
  const { colors } = useTheme();
  const isOwner = member.role === 'Owner';
  const badgeBg = isOwner ? colors.infoBg : colors.secondaryBg;
  const badgeColor = isOwner ? colors.primary : colors.muted;
  const initials = initialsOf(member.name);

  const openActions = () => {
    Alert.alert(member.name, 'Manage member access', [
      {
        text: 'View role',
        onPress: () => Alert.alert(`${member.name} · ${member.role}`, ROLE_ACCESS[member.role]),
      },
      { text: 'Change role', onPress: () => Alert.alert('Change role', NOT_CONNECTED) },
      { text: 'Remove', onPress: () => Alert.alert('Remove member', NOT_CONNECTED) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, { backgroundColor: colors.infoBg }]}>
          {initials ? (
            <Txt style={[Type.name15, { color: colors.primary }]}>{initials}</Txt>
          ) : (
            <User size={22} color={colors.primary} strokeWidth={2} />
          )}
        </View>
        {member.online ? (
          <View
            accessibilityLabel="Online"
            style={[styles.onlineDot, { backgroundColor: colors.success, borderColor: '#FFFFFF' }]}
          />
        ) : null}
      </View>
      <View style={styles.details}>
        <Txt style={[Type.name15, { color: colors.text }]} numberOfLines={1}>
          {member.name}
        </Txt>
        <Badge label={member.role} bg={badgeBg} color={badgeColor} size="role" style={styles.roleBadge} />
      </View>
      <Pressable
        onPress={openActions}
        accessibilityRole="button"
        accessibilityLabel={`Options for ${member.name}, ${member.role}`}
        hitSlop={12}
        style={({ pressed }) => [styles.moreBtn, { opacity: pressed ? 0.6 : 1 }]}
      >
        <MoreHorizontal size={20} color={colors.muted} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

export default function Team() {
  const addMember = () => {
    Alert.alert('Add member', NOT_CONNECTED);
  };

  return (
    <Screen scroll bottomSpace>
      <ScreenHeader title="Team Management" subtitle="Manage members and access levels" />
      <View style={styles.list}>
        {MEMBERS.map((m) => (
          <MemberCard key={m.id} member={m} />
        ))}
      </View>
      <Fab icon={Plus} onPress={addMember} />
      <BottomTabBar active="more" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingTop: 8, paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  avatarWrap: { width: 48, height: 48 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    left: 36,
    top: 36,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  details: { flex: 1, gap: 2 },
  roleBadge: { alignSelf: 'flex-start', borderRadius: 6 },
  moreBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
});
