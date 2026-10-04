import type { InvitationConfig } from "./invitation-config";
import Image from "next/image";

export function Invitation({
  config,
  innerRef,
}: {
  config: InvitationConfig;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const f = config.fields;
  return (
    <div ref={innerRef} className="invitation" id="invitation-output">
      <Image className="invitation-art" src="/assets/invitation-art.png" alt="" aria-hidden="true" width={1748} height={2480} priority />
      <div className="invitation-school" data-fit="schoolName">{f.schoolName}</div>
      <div className="invitation-location" data-fit="schoolLocation">{f.schoolLocation}</div>
      <div className="invitation-intro" data-fit="invitationIntro">{f.invitationIntro}</div>
      <div className="invitation-chief">
        <strong data-fit="chiefGuest.name">{config.chiefGuest.name}</strong>
        <span data-fit="chiefGuest.role">{config.chiefGuest.role}</span>
      </div>
      <div className="invitation-chief-label" data-fit="chiefGuestLabel">
        {f.chiefGuestPrefix} <em>{f.chiefGuestLabel}</em>
      </div>
      <div className="invitation-separator" data-fit="guestSeparator">{f.guestSeparator}</div>
      <div className="invitation-guests" data-fit="guestList">
        {config.guests.map((guest, index) => (
          <div className="invitation-guest" key={index}>
            <strong data-fit={`guest.${index}.name`}>{guest.name}</strong>
            <span data-fit={`guest.${index}.role`}>{guest.role}</span>
          </div>
        ))}
      </div>
      <div className="invitation-other-guests" data-fit="otherGuestsLine">{f.otherGuestsLine}</div>
      <div className="invitation-event-intro" data-fit="eventIntro">{f.eventIntro}</div>
      <div className="invitation-event-title" data-fit="eventTitle">{f.eventTitle}</div>
      <div className="invitation-ceremony" data-fit="ceremonyLabel">{f.ceremonyLabel}</div>
      <div className="invitation-date-time" data-fit="dateTime">{f.dateTime}</div>
      <div className="invitation-venue" data-fit="venueLine">{f.venueLine}</div>
      <div className="invitation-host" data-fit="hostLine">{f.hostLine}</div>
    </div>
  );
}
