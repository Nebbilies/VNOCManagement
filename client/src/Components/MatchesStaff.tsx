import {Staff} from "./StaffComponent.tsx";

interface StaffMemberProps {
    username: string;
    id: number;
    size?: 'sm' | 'md';
}

interface StaffRoleProps {
    title: string;
    members: Staff[];
}

const StaffMember = ({ username, id, size = 'sm' }: StaffMemberProps) => (
    <div className="flex items-center gap-2">
        <img
            src={`https://a.ppy.sh/${id}`}
            alt={username}
            className={`${size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'} rounded-full border-2 border-gray-600`}
        />
        <span className="text-sm text-gray-300 truncate">{username}</span>
    </div>
);

// Staff role component
export const StaffRole = ({ title, members } : StaffRoleProps) => (
    <div className="flex flex-col items-center gap-2 min-w-0">
        <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {title}
      </span>
        </div>
        <div className="flex flex-col gap-1 w-full">
            {members.map((member, index) => (
                <StaffMember
                    key={index}
                    username={member.Username}
                    id={member.Id}
                />
            ))}
        </div>
    </div>
);