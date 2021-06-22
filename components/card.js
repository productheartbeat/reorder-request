import React from 'react';
import Link from 'next/Link';
import Layout from './layout';

export default function Card(props) {
    return (
        
        <div className="card-wrapper md:py-0 relative sm:max-w-2xl sm:mx-auto w-full">
            <div className="card relative bg-white shadow-lg rounded-xl sm:rounded-3xl w-full border-b-8 border-green-600">
                <div className="card-body px-4 py-10 sm:p-20">
                    <Link href="/help">
                        <a className="absolute top-3 right-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </Link>
                    {props.merchantLogoUrl
                    ?
                        <div className="w-40 mx-auto mb-8">
                            <img className="w-full max-w-full " src={props.merchantLogoUrl} />
                        </div>
                    : 
                        ""
                    }
                    
                    {props.children}

                </div>
                {props.cardFooter 
                ? 
                    <div className="text-sm text-center p-6 w-full bg-gray-100 text-gray-800 rounded-b-xl"><span>{props.cardFooterContent}</span></div>
                : 
                    ""
                }
            </div>
        </div>

    )
}
