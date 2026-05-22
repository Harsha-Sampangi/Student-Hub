import { Metadata } from 'next';
import TeamContent from './TeamContent';

export const metadata: Metadata = {
  title: 'Team',
  description:
    'Meet the passionate team behind Student Hub — building India\'s largest open student community.',
};

export default function TeamPage() {
  return <TeamContent />;
}
