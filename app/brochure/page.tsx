import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { emphasise } from "@/components/typography/Em";
import RevealObserver from "@/components/scroll/RevealObserver";
import BrochureRail from "@/components/brochure/BrochureRail";
import PlateFigure from "@/components/brochure/PlateFigure";
import PlateRecord from "@/components/brochure/PlateRecord";
import PrintButton from "@/components/brochure/PrintButton";
import { priceLabel, statusLabel } from "@/lib/format";
import {
  buying,
  closing,
  colophon,
  foreword,
  issue,
  plates,
} from "@/content/brochure";
import "./brochure.css";

export const metadata: Metadata = {
  title: `The catalogue, issue ${issue.number.toLowerCase()}`,
  description:
    "Six pieces from the House of Chairs collection, photographed in daylight against white, described plainly and sold by enquiry. Read it here or print it.",
  openGraph: {
    title: "The catalogue, House of Chairs",
    description: `${issue.title}, issue ${issue.number.toLowerCase()}, ${issue.season}.`,
    type: "website",
  },
  alternates: { canonical: "/brochure" },
};

/* Which leaf each plate is printed on, so the contents can point at it and the
   specification index can send a reader back to the photograph. Plates 04 and
   05 share a leaf because they are the same stool in two colours and are shown
   as the pair they are. */
const LEAF_OF_PLATE: Record<string, string> = {
  "01": "04",
  "02": "05",
  "03": "06",
  "04": "07",
  "05": "07",
  "06": "08",
};

const TOTAL_LEAVES = 12;

const CONTENTS = [
  { folio: "03", title: "Foreword", hedge: "What this is" },
  { folio: "04", title: "Plate 01, chrome pod chair", hedge: "Maker unconfirmed" },
  { folio: "05", title: "Plate 02, moulded S chair", hedge: "In the manner of" },
  { folio: "06", title: "Plate 03, aluminium armchair", hedge: "Maker unconfirmed" },
  { folio: "07", title: "Plates 04 and 05, the counter stools", hedge: "A pair, or not" },
  { folio: "08", title: "Plate 06, aluminium counter stool", hedge: "Stamped" },
  { folio: "09", title: "Buying", hedge: "How a piece leaves us" },
  { folio: "10", title: "Specification index", hedge: "The six, in one table" },
  { folio: "11", title: "Order form", hedge: "Tell us which piece" },
  { folio: "12", title: "Colophon", hedge: "How this was made" },
];

const [pod, sChair, armchair, orangeStool, blackStool, aluStool] = plates;

const issueLine = `${issue.title}, issue ${issue.number.toLowerCase()}`;

/**
 * The catalogue: a printed brochure rebuilt for the web.
 *
 * It keeps the devices that make a brochure read as a document, a cover with
 * trim marks, a contents with dot leaders, numbered plates, folios in the
 * corners, back matter and a colophon, and adds the three things paper cannot
 * do: a running head that fills as you read, an enquiry one tap from every
 * plate, and a print stylesheet that hands the whole thing back as A4.
 *
 * Chairs lead, per the conversion rules: the three chairs take plates 01 to
 * 03 and the stools follow. Every photograph is a real piece from the
 * collection and every attribution is a hedge.
 */
export default function BrochurePage() {
  return (
    <>
      <BrochureRail issueLine={issueLine} total={TOTAL_LEAVES} />

      <main className="brochure" id="br-doc">
        {/* ---------------- 01, the cover ---------------- */}
        <section
          className="br-cover"
          id="leaf-01"
          data-folio="01"
          data-head={issueLine}
          aria-labelledby="br-cover-h"
        >
          <span className="br-crop" data-corner="tl" aria-hidden="true" />
          <span className="br-crop" data-corner="tr" aria-hidden="true" />
          <span className="br-crop" data-corner="bl" aria-hidden="true" />
          <span className="br-crop" data-corner="br" aria-hidden="true" />

          <div className="br-cover-grid">
            <p className="br-cover-mark mono">
              <Image
                src="/logo/Logo.svg"
                alt="House of Chairs"
                width={1557}
                height={650}
                className="br-cover-logo"
                unoptimized
                priority
              />
              <span>The catalogue</span>
            </p>

            <div className="br-cover-copy">
              <h1 id="br-cover-h">{emphasise(issue.headline)}</h1>
              <p className="br-cover-strap accent">{issue.strapline}</p>

              <p className="br-cover-meta mono">
                <span>Issue {issue.number.toLowerCase()}</span>
                <span>{issue.season}</span>
                <span>{issue.place}</span>
                <span>Six plates</span>
              </p>

              <div className="br-cover-cta">
                <a className="br-btn br-btn-solid" href="#leaf-02">
                  Read the catalogue
                </a>
                <PrintButton />
              </div>
            </div>

            <div className="br-cover-plate">
              <span className="br-cover-issue" aria-hidden="true">
                <small>Issue</small>
                <strong>{issue.numeral}</strong>
              </span>
              <PlateFigure
                plate={pod}
                sizes="(max-width: 860px) 88vw, 46vw"
                priority
                caption={false}
              />
            </div>
          </div>
        </section>

        {/* ---------------- 02, contents ---------------- */}
        <section
          className="br-leaf"
          id="leaf-02"
          data-folio="02"
          data-head="Contents"
          aria-labelledby="br-contents-h"
        >
          <div className="br-contents-grid reveal">
            <div>
              <span className="br-eyebrow mono">Contents</span>
              <h2 className="br-h" id="br-contents-h">
                Six pieces, in order
              </h2>
              <p className="br-lede">
                Chairs first, then the stools. Each plate carries what the
                photograph shows, what the piece is made of, and what is known
                of its maker, which on most of these is honestly not much.
              </p>
            </div>

            <ol className="br-toc">
              {CONTENTS.map((row) => (
                <li key={row.folio}>
                  <a href={`#leaf-${row.folio}`}>
                    <span className="br-toc-no mono">{row.folio}</span>
                    <span className="br-toc-title">{row.title}</span>
                    <span className="br-toc-hedge accent">{row.hedge}</span>
                    <span className="br-toc-dots" aria-hidden="true" />
                    <span className="br-toc-folio mono" data-folio={row.folio}>
                      Leaf {row.folio}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <span className="br-folio mono" aria-hidden="true">
            02
          </span>
        </section>

        {/* ---------------- 03, foreword ---------------- */}
        <section
          className="br-leaf br-leaf--panel"
          id="leaf-03"
          data-folio="03"
          data-head="Foreword"
          aria-labelledby="br-foreword-h"
        >
          <div className="br-foreword-grid reveal">
            <div>
              <span className="br-eyebrow mono">{foreword.eyebrow}</span>
              <h2 className="br-h" id="br-foreword-h">
                {foreword.heading}
              </h2>
              <span className="br-sign accent">{foreword.signature}</span>
            </div>
            <div className="br-foreword">
              {foreword.paragraphs.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </div>
          <span className="br-folio mono" aria-hidden="true">
            03
          </span>
        </section>

        {/* ---------------- 04, plate 01 ---------------- */}
        <section
          className="br-leaf"
          id="leaf-04"
          data-folio="04"
          data-head={`Plate 01, ${pod.title.toLowerCase()}`}
          aria-labelledby={`plate-${pod.number}`}
        >
          <div className="br-plate reveal">
            <div className="br-plate-figure">
              <PlateFigure plate={pod} sizes="(max-width: 860px) 92vw, 44vw" />
            </div>
            <PlateRecord plate={pod} />
          </div>
          <span className="br-folio mono" aria-hidden="true">
            04
          </span>
        </section>

        {/* ---------------- 05, plate 02, the dark spread ---------------- */}
        <section
          className="br-leaf br-leaf--dark"
          id="leaf-05"
          data-folio="05"
          data-head={`Plate 02, ${sChair.title.toLowerCase()}`}
          aria-labelledby={`plate-${sChair.number}`}
        >
          <div className="br-plate br-plate--flip reveal">
            <div className="br-plate-figure">
              <PlateFigure
                plate={sChair}
                sizes="(max-width: 860px) 92vw, 44vw"
              />
            </div>
            <PlateRecord plate={sChair} />
          </div>
          <span className="br-folio mono" aria-hidden="true">
            05
          </span>
        </section>

        {/* ---------------- 06, plate 03 ---------------- */}
        <section
          className="br-leaf"
          id="leaf-06"
          data-folio="06"
          data-head={`Plate 03, ${armchair.title.toLowerCase()}`}
          aria-labelledby={`plate-${armchair.number}`}
        >
          <div className="br-plate reveal">
            <div className="br-plate-figure">
              <PlateFigure
                plate={armchair}
                sizes="(max-width: 860px) 92vw, 44vw"
              />
            </div>
            <PlateRecord plate={armchair} />
          </div>
          <span className="br-folio mono" aria-hidden="true">
            06
          </span>
        </section>

        {/* ---------------- 07, plates 04 and 05, the pair ---------------- */}
        <section
          className="br-leaf br-leaf--panel"
          id="leaf-07"
          data-folio="07"
          data-head="Plates 04 and 05, the counter stools"
          aria-labelledby="br-pair-h"
        >
          <div className="br-pair-head reveal">
            <span className="br-eyebrow mono">Plates 04 and 05</span>
            <h2 className="br-h" id="br-pair-h">
              The counter stools
            </h2>
            <p className="br-lede">
              The same moulded shell on the same chromed counter-height base, in
              two colours. Shown together because that is the decision most
              people are actually making: a matched pair, or one of each.
            </p>
          </div>

          <div className="br-pair reveal">
            {/* No caption on the pair: the record's own head names the plate
                directly beneath the photograph, and printing it twice reads
                as a proofing error rather than as a caption. */}
            <div className="br-pair-item">
              <PlateFigure
                plate={orangeStool}
                sizes="(max-width: 720px) 92vw, 44vw"
                caption={false}
              />
              <PlateRecord plate={orangeStool} headingLevel={3} />
            </div>
            <div className="br-pair-item">
              <PlateFigure
                plate={blackStool}
                sizes="(max-width: 720px) 92vw, 44vw"
                caption={false}
              />
              <PlateRecord plate={blackStool} headingLevel={3} />
            </div>
          </div>
          <span className="br-folio mono" aria-hidden="true">
            07
          </span>
        </section>

        {/* ---------------- 08, plate 06 ---------------- */}
        <section
          className="br-leaf"
          id="leaf-08"
          data-folio="08"
          data-head={`Plate 06, ${aluStool.title.toLowerCase()}`}
          aria-labelledby={`plate-${aluStool.number}`}
        >
          <div className="br-plate reveal">
            <div className="br-plate-figure">
              <PlateFigure
                plate={aluStool}
                sizes="(max-width: 860px) 92vw, 44vw"
              />
            </div>
            <PlateRecord plate={aluStool} />
          </div>
          <span className="br-folio mono" aria-hidden="true">
            08
          </span>
        </section>

        {/* ---------------- 09, buying ---------------- */}
        <section
          className="br-leaf br-leaf--dark"
          id="leaf-09"
          data-folio="09"
          data-head="Buying"
          aria-labelledby="br-buying-h"
        >
          <div className="br-buying reveal">
            <div className="br-buying-head">
              <span className="br-eyebrow mono">{buying.eyebrow}</span>
              <h2 className="br-h" id="br-buying-h">
                {emphasise(buying.heading)}
              </h2>
              <p className="br-lede">{buying.body}</p>
            </div>

            <div className="br-points">
              {buying.points.map((point) => (
                <div className="br-point" key={point.number}>
                  <span className="br-point-no mono">{point.number}</span>
                  <h3>{point.title}</h3>
                  <p>{point.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <span className="br-folio mono" aria-hidden="true">
            09
          </span>
        </section>

        {/* ---------------- 10, specification index ---------------- */}
        <section
          className="br-leaf"
          id="leaf-10"
          data-folio="10"
          data-head="Specification index"
          aria-labelledby="br-index-h"
        >
          <div className="br-index reveal">
            <span className="br-eyebrow mono">Back matter</span>
            <h2 className="br-h" id="br-index-h">
              Specification index
            </h2>
            <p className="br-lede">
              The six pieces in one table, with the plate each is photographed
              on. Measurements follow with the condition report, and prices are
              confirmed in writing before anything is agreed.
            </p>

            <div className="br-index-scroll">
              <table className="br-table">
                <caption className="mono br-print-only">
                  House of Chairs, {issue.title}, issue{" "}
                  {issue.number.toLowerCase()}, {issue.season}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Cat. no.</th>
                    <th scope="col">Piece</th>
                    <th scope="col">Attribution</th>
                    <th scope="col">Era</th>
                    <th scope="col">Status</th>
                    <th scope="col">Price</th>
                    <th scope="col">Plate</th>
                  </tr>
                </thead>
                <tbody>
                  {plates.map((plate) => (
                    <tr key={plate.slug}>
                      <td className="br-cell-no">{plate.catalogueNumber}</td>
                      <td className="br-cell-title">
                        <a href={`#plate-${plate.number}`}>{plate.title}</a>
                      </td>
                      <td className="br-cell-hedge">{plate.attribution}</td>
                      <td>{plate.era}</td>
                      <td>{statusLabel(plate.status)}</td>
                      <td>
                        {priceLabel(plate.pricePence == null, plate.pricePence)}
                      </td>
                      <td className="br-cell-no">
                        <a href={`#leaf-${LEAF_OF_PLATE[plate.number]}`}>
                          {plate.number}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="br-index-note">
              Attribution here follows the house rule. A maker is named only
              where the piece carries a mark, and then as a description of the
              mark rather than an authentication. Everything else is attributed,
              in the manner of, or unconfirmed, and we would rather lose a sale
              than overstate one.
            </p>
          </div>
          <span className="br-folio mono" aria-hidden="true">
            10
          </span>
        </section>

        {/* ---------------- 11, the order form ---------------- */}
        <section
          className="br-leaf br-leaf--panel"
          id="leaf-11"
          data-folio="11"
          data-head="Order form"
          aria-labelledby="br-order-h"
        >
          <div className="br-order reveal">
            <span className="br-eyebrow mono">{closing.eyebrow}</span>
            <h2 id="br-order-h">{emphasise(closing.heading)}</h2>
            <p>{closing.body}</p>
            <div className="br-order-cta">
              <Link className="br-btn br-btn-solid" href={closing.primary.href}>
                {closing.primary.label}
              </Link>
              <Link className="br-btn br-btn-line" href={closing.secondary.href}>
                {closing.secondary.label}
              </Link>
            </div>
            <p className="br-print-only mono">
              {issue.email}, quoting the catalogue number
            </p>
          </div>
          <span className="br-folio mono" aria-hidden="true">
            11
          </span>
        </section>

        {/* ---------------- 12, colophon ---------------- */}
        <section
          className="br-leaf br-leaf--dark"
          id="leaf-12"
          data-folio="12"
          data-head="Colophon"
          aria-labelledby="br-colophon-h"
        >
          <div className="br-colophon reveal">
            <div className="br-colophon-mark">
              <svg className="br-reg" viewBox="0 0 44 44" aria-hidden="true">
                <circle
                  cx="22"
                  cy="22"
                  r="13"
                  fill="none"
                  stroke="currentColor"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="4.5"
                  fill="none"
                  stroke="currentColor"
                />
                <path d="M22 2v40M2 22h40" stroke="currentColor" />
              </svg>
              <span className="br-eyebrow mono" style={{ marginTop: "1.2rem" }}>
                Colophon
              </span>
              <h2 className="br-h" id="br-colophon-h">
                How this was made
              </h2>
              <p className="accent">{colophon.note}</p>
            </div>

            <div>
              <dl>
                {colophon.lines.map((line) => (
                  <div key={line.term}>
                    <dt className="mono">{line.term}</dt>
                    <dd>{line.detail}</dd>
                  </div>
                ))}
              </dl>
              <p className="br-colophon-foot mono">
                <span>House of Chairs</span>
                <span>{issue.email}</span>
                <span>MMXXVI</span>
              </p>
              <div className="br-colophon-cta">
                <PrintButton label="Print this catalogue" />
              </div>
            </div>
          </div>
          <span className="br-folio mono" aria-hidden="true">
            12
          </span>
        </section>

        <RevealObserver />
      </main>
    </>
  );
}
