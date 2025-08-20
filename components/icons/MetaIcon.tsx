import React from 'react';

const MetaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a.75.75 0 00.75-.75V11.382l6.995-3.18a.75.75 0 00-.5-1.399L12 9.81.755 6.803a.75.75 0 00-.5 1.4l6.995 3.18V17.25A.75.75 0 0012 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.522m0 0l-7.245-3.292M12 12.478l7.245-3.292M12 12.478v5.522" />
    </svg>
);

export default MetaIcon;
