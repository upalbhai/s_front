import React from 'react';
import { BaseButtonProps } from './BaseButtonProps';
import Classic3DButton from './Classic3DButton';

interface ButtonRendererProps extends BaseButtonProps {
  siteId?: string;
}

export default function ButtonRenderer({ siteId, ...props }: ButtonRendererProps) {
  return <Classic3DButton {...props} />;
}
