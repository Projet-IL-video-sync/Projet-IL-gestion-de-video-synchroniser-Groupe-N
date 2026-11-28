"use client";

export default function MemberList({
  members = [],
  maxParticipants = 10,
  currentClientId = null,
}) {
  return (
    <div className="pb-4 border-b border-gray-800">
      <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">
        Participants ({members.length}/{maxParticipants})
      </h2>

      <ul className="space-y-1.5 text-sm max-h-60 overflow-y-auto pr-1">
        {members.length === 0 ? (
          <li className="text-xs text-gray-500 italic">Aucun participant</li>
        ) : (
          members.map((member) => {
            const isSelf = member.clientId === currentClientId;

            return (
              <li
                key={member.clientId}
                className="flex items-center gap-2 text-gray-200"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <span className="truncate">{member.pseudo}</span>
                {isSelf && (
                  <span className="text-xs text-gray-400">(Vous)</span>
                )}
                {member.isAdmin && (
                  <span className="text-xs text-blue-400">(Admin)</span>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
