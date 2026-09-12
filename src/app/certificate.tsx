import Image from "next/image";
import type { CertificateConfig } from "./certificate-config";

export function Certificate({
  config,
  innerRef,
}: {
  config: CertificateConfig;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const f = config.fields;
  return (
    <div ref={innerRef} className="certificate" id="certificate-output">
      <div className="certificate-rule top" />
      <div className="crest">
        <Image
          src="/assets/rcc-logo.png"
          alt="Roman Catholic College crest"
          width={82}
          height={76}
          priority
        />
      </div>
      <div className="school-name">{f.schoolName}</div>
      <div className="school-location">{f.schoolLocation}</div>
      <div className="title">{f.title}</div>
      <div className="subtitle">{f.subtitle}</div>
      <div className="award-intro">{f.awardIntro}</div>
      <div className="ruled-field recipient" data-fit="recipientName">
        {f.recipientName || "\u00a0"}
      </div>
      <div className="achievement">
        <span>{f.achievementPrefix} </span>
        <strong>{f.achievement}</strong>
        <span> {f.achievementSuffix}</span>
      </div>
      <div className="ruled-field competition" data-fit="competitionName">
        {f.competitionName || "\u00a0"}
      </div>
      <div className="program-line">{f.programLine}</div>
      <div className="organizer-line">
        <span>{f.organizerPrefix} </span>
        <strong>{f.organizerName}</strong>
      </div>
      <div className={`signatures count-${config.signatureCount}`}>
        {config.signatures.slice(0, config.signatureCount).map((sig, index) => (
          <div className="signature" key={index}>
            <div className="signature-rule" />
            <div>{sig.name || "\u00a0"}</div>
            <div>{sig.role || "\u00a0"}</div>
            <div>{sig.organization || "\u00a0"}</div>
          </div>
        ))}
      </div>
      {config.showSeal && (
        <Image
          className="seal"
          src="/assets/star.svg"
          alt="Red seal"
          width={82}
          height={82}
        />
      )}
      <div className="date">{f.date}</div>
      <div className="certificate-rule bottom" />
    </div>
  );
}
