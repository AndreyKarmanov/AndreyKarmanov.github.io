import React from "react";

class introduction extends React.PureComponent {
    render() {
        return (
            <div className="list-group shadow-lg border rounded">
                <div className="bg-light list-group-item">
                    <div className="container-fluid">
                        <div className="row w-100">
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
                                        <img className="rounded" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&amp;logo=linkedin&amp;logoColor=white" />
                                    </a>
                                </li>
                                <li className="nav-item mx-1">
                                    <a href="https://github.com/AndreyKarmanov" >
                                        <img className="rounded" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
                                    </a>
                                </li>
                                <li className="nav-item mx-1">
                                    <a href="/Andrey_Karmanov_Resume_8-2021.pdf" >
                                        <img className="rounded" src="/Express.svg" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};


export default introduction;