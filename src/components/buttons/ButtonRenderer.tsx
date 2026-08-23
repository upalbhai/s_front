import React from 'react';
import { BaseButtonProps } from './BaseButtonProps';
import Classic3DButton from './Classic3DButton';
import GlossyButton from './GlossyButton';
import ClayButton from './ClayButton';

interface ButtonRendererProps extends BaseButtonProps {
  siteId: string;
}

export default function ButtonRenderer({ siteId, ...props }: ButtonRendererProps) {
  switch (siteId) {
    case 'soundbuttons':
      return <ClayButton {...props} />;
    case 'soundboard':
    case 'soundbuttonsguys':
    default:
      return <Classic3DButton {...props} />;
  }
}
