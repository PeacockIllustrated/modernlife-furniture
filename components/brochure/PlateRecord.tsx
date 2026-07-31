import Link from "next/link";
import { priceLabel, statusLabel } from "@/lib/format";
import { emphasise } from "@/components/typography/Em";
import type { BrochurePlate } from "@/content/brochure";

/**
 * Everything on a plate that is not the photograph: the plate number and
 * catalogue reference on a rule, the title, the hedged attribution, the
 * description, the specification record, and the buy line.
 *
 * `dimensions` is null until somebody has measured the piece, and it renders
 * as a promise rather than a number. A brochure that guesses a width is worse
 * than one that admits it has not measured yet.
 */
export default function PlateRecord({
  plate,
  headingLevel = 2,
}: {
  plate: BrochurePlate;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const price = priceLabel(plate.pricePence == null, plate.pricePence);

  return (
    <div className="br-plate-record">
      <p className="br-plate-head mono">
        <span className="br-plate-no">Plate {plate.number}</span>
        <span className="br-plate-head-sep" aria-hidden="true" />
        <span>{plate.catalogueNumber}</span>
      </p>

      <Heading id={`plate-${plate.number}`}>{plate.title}</Heading>
      <span className="br-attribution accent">{plate.attribution}</span>

      <p className="br-plate-body">{plate.body}</p>
      <span className="br-aside accent">{emphasise(plate.aside)}</span>

      <dl className="br-specs">
        <div>
          <dt className="mono">Era</dt>
          <dd>
            {plate.era}. {plate.dating}
          </dd>
        </div>
        {plate.specs.map((spec) => (
          <div key={spec.term}>
            <dt className="mono">{spec.term}</dt>
            <dd>{spec.detail}</dd>
          </div>
        ))}
        <div>
          <dt className="mono">Dimensions</dt>
          <dd>{plate.dimensions ?? "Measured for you, and sent with the condition report"}</dd>
        </div>
      </dl>

      <div className="br-acquire">
        <span className="br-status mono" data-status={plate.status}>
          <span className="br-dot" aria-hidden="true" />
          {statusLabel(plate.status)}
        </span>
        <span className="br-price">{price}</span>
        <Link className="br-btn br-btn-solid" href="/enquire">
          Enquire about plate {plate.number}
        </Link>
        <span className="br-print-only mono">
          Quote {plate.catalogueNumber} to sales@houseofchairs.co.uk
        </span>
      </div>
    </div>
  );
}
