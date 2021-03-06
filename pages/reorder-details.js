import React, {useState, useContext} from "react";
import { withRouter } from 'next/router'
import Router from 'next/router';
import Button from "../components/button"
import SvgIcon from "../components/icons"
import Layout from "../components/layout";
import FormTextarea from "../components/formTextarea";
import ReorderDetailsDamaged from "../components/reorderDetailsDamaged";
import ReorderDetailsLost from "../components/reorderDetailsLost";
import ReorderDetailsStolen from "../components/reorderDetailsStolen";

const ReorderDetails = (props) => {

  const claimReason = props.router.query.reason;
  const [claimMessage, setClaimMessage] = useState('');
  const [nothingCheckedMessage, setNothingCheckedMessage] = useState('');

  const onClaimMessageChange = event => {
    setClaimMessage(event.target.value);
  };  

  const handleDamageSubmit=(e)=>{
    const reorderIds = JSON.parse(localStorage.getItem("reorder_ids"));
    if (reorderIds.length > 0) {
      e.preventDefault();
      const claimMessageFromTextArea = {
          'Claim Message' : claimMessage
      }
      localStorage.setItem("claim_message", claimMessage)
      Router.push({
        pathname: '/review',
        query: {reason: props.router.query.reason, type: props.router.query.type}
      });
    } else {
      setNothingCheckedMessage('Please choose at least one product');
    }
  }

  if (claimReason === "damaged") {
    return (
      <div>
        <ReorderDetailsDamaged />
        <div className="mt-8">
          <FormTextarea label="Any other comments?" id="claimComments" name="claim_comment" value={claimMessage} onChange={onClaimMessageChange} />
        </div>
        {nothingCheckedMessage != '' && <div className="text-red-500 text-sm absolute mt-2">{nothingCheckedMessage}</div>}
        <div className="mt-12">
          <Button label="Next" path="/review" onClick={handleDamageSubmit}>
            <SvgIcon role="arrow-right" />
          </Button>
        </div>
      </div>
    )
  } else if (claimReason === "lost") {
    return (
      <div>
        <ReorderDetailsLost />
        <div className="mt-8">
          <FormTextarea label="Any other comments?" id="claimComments" name="claim_comment" value={claimMessage} onChange={onClaimMessageChange} />
        </div>
        <div className="mt-12">
          <Button label="Next" path="/review" onClick={handleDamageSubmit}>
            <SvgIcon role="arrow-right" />
          </Button>
        </div>
      </div>
    )
  } else if (claimReason === "stolen") {
    return (
      <div>
        <ReorderDetailsStolen />
        <div className="mt-8">
          <FormTextarea label="Any other comments?" id="claimComments" name="claim_comment" value={claimMessage} onChange={onClaimMessageChange} />
        </div>
        <div className="mt-12">
          <Button label="Next" path="/review" onClick={handleDamageSubmit}>
            <SvgIcon role="arrow-right" />
          </Button>
        </div>
      </div>
    )
  }

  return(null)

}

export default withRouter(ReorderDetails);
