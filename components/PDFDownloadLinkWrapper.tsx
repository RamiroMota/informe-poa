import { PDFDownloadLink as PDFDownloadLinkComponent } from '@react-pdf/renderer';
import { ReactNode, ReactElement, JSXElementConstructor } from 'react';
import { DocumentProps } from '@react-pdf/renderer';

interface PDFDownloadLinkProps {
  document: ReactElement<DocumentProps, string | JSXElementConstructor<any>>;
  fileName: string;
  children: ({ loading }: { loading: boolean }) => ReactNode;
}

export default function PDFDownloadLink({ document, fileName, children }: PDFDownloadLinkProps) {
  return (
    <PDFDownloadLinkComponent document={document} fileName={fileName}>
      {children}
    </PDFDownloadLinkComponent>
  );
}