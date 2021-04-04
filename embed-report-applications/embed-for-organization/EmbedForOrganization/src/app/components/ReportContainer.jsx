import React, {useEffect, useState} from "react"
import {PowerBIEmbed} from 'powerbi-client-react'
import {models} from 'powerbi-client';
import * as config from "../config/Config"

const ReportContainer  = (props)=> {

	const [reportProperties, setReportProperties] = useState(null);
	const [embedURL, setEmbedURL] = useState(null);
	const [loading, isLoading] = useState(true);

	const getEmbedUrl = async (accessToken, reportID) => {
		const response = await fetch("https://api.powerbi.com/v1.0/myorg/groups/" + config.workspaceId + "/reports/" + reportID, {
			headers: { "Authorization": "Bearer " + accessToken },
			method: "GET"
		});
		if(!response.ok){
			console.log("Error fetchiing the embed URL.");
			return null;
		}

		const body = await response.json();
		return body["embedUrl"];
	}

	useEffect(() => {
		isLoading(true);
		try{
			if (props && props.access_token && props.report_id){
				getEmbedUrl(props.access_token, props.report_id)
					.then((embedUrl) => {
						if(embedUrl){
							setEmbedURL(embedUrl);
							setReportProperties({...props});
							isLoading(false);
						}
						else{
							console.log("Bad embed URL getted:", embedUrl);
						}
					});
			}
			else{
				console.log("Bad props settled.", {...props});
			}
		}
		catch(error){
			console.log(error);
		}

	}, [props]);

	if(loading)
		return (<div className="report">loading...</div>);

	return (<PowerBIEmbed
		embedConfig={{
			type: "report",   // Supported types: report, dashboard, tile, visual and qna
			id: reportProperties.report_id,
			embedUrl: embedURL,
			accessToken: reportProperties.access_token,    // Keep as empty string, null or undefined
			tokenType: models.TokenType.Aad,
			settings: {
				panes: {
					filters: {
						expanded: false,
						visible: false
					},
					pageNavigation: {
						visible: reportProperties.show_pages
					}
				},
				background: models.BackgroundType.Transparent,
			}
		}}
		cssClassName={"report"}
	/>);
}

export default ReportContainer;