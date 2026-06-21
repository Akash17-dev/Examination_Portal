import { ProfilePanel } from "./ProfilePanel";

export function FacultyProfilePanel({ teacher }) {
  return <ProfilePanel user={teacher} roleLabel="Faculty" />;
}
