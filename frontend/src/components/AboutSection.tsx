import ExternalLink from "./ExternalLink";
import LinkIcon from "../icons/link.svg?react";
import Source from "./Source";

export default function AboutSection() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-900">About This Tool</h2>
      <div className="flex flex-col gap-2">
        <p>
          <em>Monoclonal Gammopathy of Undetermined Significance</em> (MGUS) is a blood condition occurring in around 3% of people over the age of 50.<Source num={1} href="https://www.onkopedia.com/de/onkopedia/guidelines/monoklonale-gammopathie-unklarer-signifikanz-mgus" /> While usually harmless, MGUS can progress to <em>Multiple Myeloma</em> (MM), a dangerous type of blood cancer, with a chance of around 1% per year.<Source num={1} href="https://www.onkopedia.com/de/onkopedia/guidelines/monoklonale-gammopathie-unklarer-signifikanz-mgus" /> However, the risk of developing MM varies widely from patient to patient.
        </p>
        <p>
          Just a few key blood measurements make it possible to predict the risk of an MGUS patient developing MM.<Source num={2} href="https://pubmed.ncbi.nlm.nih.gov/36858677/" /> These predictions can be further improved by taking genetic factors into account.<Source num={3} href="https://pubmed.ncbi.nlm.nih.gov/34845334/" /> This app is a research prototype allowing MGUS patients to predict MM progression risk based on their biomarkers.
        </p>
        <p>
          Developed by <ExternalLink href="https://dcermann.de">Daniel Cermann</ExternalLink> and <ExternalLink href="https://jan-berndt.de">Jan Berndt</ExternalLink> in the 2025/26 winter semester for the class <em>Biomedical Data Types and Analyses</em> at <ExternalLink href="https://hpi.de">HPI</ExternalLink>. Inspired by the <ExternalLink href="https://pangeamodels.org">PANGEA-SMM Calculator</ExternalLink>.
        </p>
      </div>
      <a
          href="https://github.com/jafber/myeloma-predict/blob/main/paper.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start rounded-md bg-teal-700 px-4 py-2 text-white hover:bg-teal-800"
        >
          <LinkIcon className="size-4" />
          Read the full paper here
        </a>
    </div>
  );
}
