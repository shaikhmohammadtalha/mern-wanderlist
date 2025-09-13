import { Helmet } from "react-helmet-async";

export default function SeoHelmet() {
	return (
		<Helmet>
			<title>WanderList – Plan Your Dream Travel</title>
			<meta
				name="description"
				content="WanderList helps you plan, organize, and visualize your dream travel destinations with an interactive world map."
			/>
			<meta
				name="keywords"
				content="Travel, WanderList, Map, Bucket List, Adventure, Destinations"
			/>
			<meta name="author" content="WanderList Team" />
			<meta name="creator" content="WanderList" />
			<meta name="publisher" content="WanderList" />

			{/* Open Graph */}
			<meta property="og:type" content="website" />
			<meta property="og:locale" content="en_US" />
			<meta property="og:url" content="https://mern-wanderlist.vercel.app/" />
			<meta property="og:site_name" content="WanderList" />
			<meta property="og:title" content="WanderList – Plan Your Dream Travel" />
			<meta
				property="og:description"
				content="Plan, organize, and visualize your dream travel destinations on an interactive world map."
			/>

			{/* Robots & Canonical */}
			<meta name="robots" content="index, follow" />
			<link rel="canonical" href="https://mern-wanderlist.vercel.app/" />
		</Helmet>
	);
}
