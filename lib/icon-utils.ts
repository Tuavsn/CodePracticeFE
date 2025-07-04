import { ACHIEVEMENT, ROLE } from "@/types/user";
import { Award, User, UserCheck } from 'lucide-react';
import React from "react";

export function getArchievementIcon(archievement: (keyof typeof ACHIEVEMENT)): React.ReactNode {
  let icon: React.ReactElement;
  let text: React.ReactElement;
  switch (archievement) {
    case ACHIEVEMENT.BEGINNER:
      icon = React.createElement(Award, { className: 'h-4 w-4 text-[#9ca3af]' });
      text = React.createElement('span', { className: 'text-sm text-[#9ca3af]' }, ACHIEVEMENT.BEGINNER.toLowerCase());
    case ACHIEVEMENT.INTERMEDIATE:
      icon = React.createElement(Award, { className: 'h-4 w-4 text-[#facc15]' })
      text = React.createElement('span', { className: 'text-sm text-[#facc15]' }, ACHIEVEMENT.INTERMEDIATE.toLowerCase());
    case ACHIEVEMENT.EXPERT:
      icon = React.createElement(Award, { className: 'h-4 w-4 text-[#ea580c]' })
      text = React.createElement('span', { className: 'text-sm text-[#ea580c]' }, ACHIEVEMENT.EXPERT.toLowerCase());
    default:
      icon = React.createElement(Award, { className: 'h-4 w-4 text-[#9ca3af]' })
      text = React.createElement('span', { className: 'text-sm text-[#9ca3af]' }, ACHIEVEMENT.BEGINNER.toLowerCase());
  }
  return React.createElement(
    'div',
    { className: 'flex items-center gap-1' },
    icon,
    text
  )
}

export function getRoleIcon(role: (keyof typeof ROLE)): React.ReactNode {
  let icon: React.ReactElement;
  let text: React.ReactElement;
  switch (role) {
    case ROLE.USER:
      icon = React.createElement(User, { className: 'h-4 w-4 text-[#9ca3af]' });
      text = React.createElement('span', { className: 'text-sm text-[#9ca3af]' }, ROLE.USER.toLowerCase());
    case ROLE.ADMIN:
      icon = React.createElement(UserCheck, { className: 'h-4 w-4 text-[#0476D0]' })
      text = React.createElement('span', { className: 'text-sm text-[#0476D0]' }, ROLE.ADMIN.toLowerCase());
    default:
      icon = React.createElement(User, { className: 'h-4 w-4 text-[#9ca3af]' })
      text = React.createElement('span', { className: 'text-sm text-[#9ca3af]' }, ROLE.USER.toLowerCase());
  }
  return React.createElement(
    'div',
    { className: 'flex items-center gap-1' },
    icon,
    text
  )
}