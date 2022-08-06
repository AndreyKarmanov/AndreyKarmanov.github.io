import React from "react";

class introduction extends React.PureComponent {
    render() {
        return (
            <div className="list-group shadow-lg border rounded">
                <div className="bg-light list-group-item">
                    <h1 className="text-center">
                        Andrey Karmanov
                    </h1>
                    <hr className="mt-4" />
                    {/* <div class="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="andrey-karmanov" data-version="v1">
                                <a class="badge-base__link LI-simple-link" href="https://ca.linkedin.com/in/andrey-karmanov?trk=profile-badge">Andrey Karmanov</a>
                            </div> */}
                    <ul className="nav justify-content-center">
                        <li className="nav-item mx-1">
                            <a href="https://linkedin.com/in/andrey-karmanov" >
                                <img className="rounded" alt="LinkedIn link" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&amp;logo=linkedin&amp;logoColor=white" />
                            </a>
                        </li>
                        <li className="nav-item mx-1">
                            <a href="https://github.com/AndreyKarmanov" >
                                <img className="rounded" alt="Github link" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
                            </a>
                        </li>
                        <li className="nav-item mx-1">
                            <a href="/Andrey_Karmanov_Resume_8-2021.pdf" >
                                <img className="rounded" alt="Resume link" src="/Express.svg" />
                            </a>
                        </li>
                    </ul>
                    <hr />
                    {/* <div className="continer-fluid row">
                        <div className="col-6">
                            *Description or life story?*
                        </div>
                        <div className="col-6">
                            *cute pic of me*
                        </div>
                    </div> */}
                </div>
            </div>
        );
    };
};


export default introduction;