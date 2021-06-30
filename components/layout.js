import Header from "./header"
import Footer from "./footer"
import Router from 'next/router';
import { withRouter } from 'next/router'
import SvgIcon from "../components/icons"
import { useContext } from 'react';
import OrderContext from '../components/OrderContext';

const Layout = (props) => {

	const { startOver, orderNumber } = useContext(OrderContext);

	const page = props.router.query.page;
  const claimId = props.router.query.claimId;

  if (claimId === null) {
    var showBack = false
  } else {
    var showBack = true
  }

	const goToHelp=()=>{
		Router.push({
			pathname: '/help',
			query: {page: "help"}
		});
	}

	const backLogic=()=>{
		if (Router.pathname != "/store-message") {
			Router.back();
		} else {
			startOver();
		}
	}

	return (
		<div className="min-h-full h-full relative" key={0}>
			<div className="content-wrapper min-h-full relative">
				<Header />
				<main className="max-w-2xl mx-auto p-4 md:py-16 pb-12 w-full">
					<div className="card-wrapper md:py-0 relative sm:max-w-2xl sm:mx-auto w-full">
						<div className="card relative bg-white shadow-lg rounded-xl sm:rounded-3xl w-full border-b-8 border-green-600">
							<div className="card-body px-4 py-10 sm:p-20">
								{showBack
								?
									<span onClick={backLogic} className="absolute top-3 left-3 cursor-pointer font-bold text-green-700">
										<div className="flex items-center">
											<SvgIcon role="arrow-left" />
											<span className="ml-1">Back</span>
										</div>
									</span>
								: 
									"" 
								}
								{page != "help" 
								?
									<span className="absolute top-3 right-3 cursor-pointer" onClick={goToHelp}>
										<SvgIcon role="question" />
									</span>
								:
									""
								}
								{props.merchantLogoUrl
									?
									<div className="w-40 mx-auto mb-8">
										<img className="w-full max-w-full " src={props.merchantLogoUrl} />
									</div>
									:
									""
								}
								<div key={0}>
									{props.children}
								</div>
							</div>
							{props.cardFooter
								?
								<div className="text-sm text-center p-6 w-full bg-gray-100 text-gray-800 rounded-b-xl"><span>{props.cardFooterContent}</span></div>
								:
								""
							}
						</div>
					</div>
				</main>
			</div>
			<Footer />
		</div>
	)
}

export default withRouter(Layout);