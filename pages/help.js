import Layout from "../components/layout"
import StepHeading from "../components/stepHeading"
import FormTextInput from "../components/formTextInput"
import SvgIcon from "../components/icons";
import Router from 'next/router';
import FormTextarea from "../components/formTextarea"
import Button from "../components/button"

export default function Help() {
  return (
    <div>
      <StepHeading title="Help" subtitle="What can we do for you?" />
      <div className="space-y-4">
        <FormTextInput name="name" id="full-name" label="Full Name" />
        <FormTextInput name="email" id="email" label="Email" />
        <FormTextarea name="comment" id="comment" label="Message" />
        <Button label="Send Message" />
      </div>
    </div>
  )
}
