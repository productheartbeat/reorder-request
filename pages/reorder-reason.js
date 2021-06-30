import React from 'react';
import { useState } from 'react';
import Router from 'next/router';
import Layout from "../components/layout";
import StepHeading from "../components/stepHeading";
import Button from "../components/button";
import SvgIcon from "../components/icons";

export default function ReorderReason() {

  const [ radioReason, setClaimReason ] = useState('');
  const [noReasonMessage, setNoReasonMessage] = useState('');

  const handleReasonChange=(e)=>{
    e.preventDefault();
    setClaimReason( e.target.value);
    setNoReasonMessage('');
  }

  const handleReasonSubmit=(e)=>{
    if (radioReason) {
      e.preventDefault();
      localStorage.setItem('claim_reason', radioReason);
      localStorage.setItem('claim_type', 'reorder');
      Router.push({
        pathname: '/reorder-details',
        query: {reason: radioReason, type: "reorder"}
      });
    } else {
      setNoReasonMessage('Please choose one of the values');
    }
  }

  const reasonRadios = [
    { 
      value: "damaged", 
      label: "It was damaged" 
    },
    { 
      value: "stolen", 
      label: "It was stolen" 
    },
    {
      value: "lost",
      label: "It was lost"
    }
  ];

  const ReasonRadios = ({ onChange, value }) => {
    return (
      <div className="flex flex-col space-y-4">
        {
          reasonRadios.map(reason => (
            <label htmlFor={reason.value} className="flex items-center" key={reason.value}>
              <input
                type="radio"
                name="reorderReason"
                id={reason.value}
                onChange={onChange}
                value={reason.value}
                checked={value === reason.value}
                className="focus:ring-blue-500 h-5 w-5 text-blue-500 border-blue-500 cursor-pointer mr-2"
              />
              {reason.label}
            </label>
          ))
        }
      </div>
    )
  }

  return (
    <div>
      <StepHeading number="3" title="What Happened?" subtitle="Green Shipping Protection protects against damage, theft, loss, and carbon emissions." />
      <div>
        <div>
          <fieldset className="space-y-4">
            <label className="text-sm">What happened to your package?</label>
            <ReasonRadios value={radioReason} onChange={handleReasonChange} />
            {noReasonMessage != '' && <div className="text-red-500 text-sm absolute mt-2">{noReasonMessage}</div>}
          </fieldset>
        </div>
        <div className="mt-12 self-start">
          <div className="space-y-4">
            <Button label="Next" onClick={e => {handleReasonSubmit(e)}}>
              <SvgIcon role="arrow-right" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
