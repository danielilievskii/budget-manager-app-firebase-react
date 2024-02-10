import "./loading.css"
import {Progressbar} from "./progressbar";
export const Loading = () => {


    return (
        <div className="loading">
            <div className="items">
                <div className="loading-image"></div>
                <Progressbar />
                {/*<p><i>A web application made by Daniel Ilievski</i> </p>*/}
            </div>

            {/*<div className="signature-image"></div>*/}

        </div>
    );
}