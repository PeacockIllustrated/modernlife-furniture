import { closing } from "@/content/landing";

/**
 * Closing room, on the deeper stone ground. Invites an enquiry and states
 * that we buy. Copy verbatim from CONTENT.md.
 */
export default function Closing() {
  return (
    <section className="closing" id="commission">
      <h2 className="reveal">
        Live with a piece
        <br />
        of history
      </h2>
      <p className="reveal">{closing.body}</p>
      <a className="big reveal" href={closing.cta.href}>
        {closing.cta.label}
      </a>
    </section>
  );
}
