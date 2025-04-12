const projectArchiveData = [
    // IMPORTANT - all svg icons must have class "lg:size-8 size-5" for styling to work
    {
        projectTitle: "CTRL Hacks",
        projectDescription: "Co-founded an independent hackathon for highschool students. I designed the three.js-powered website, and helped deal with with organizational logistics, fundraising, and outreach.",
        iconSVG: '<img class="lg:size-8 size-5" src="public/ctrl_hacks_logo.svg" alt="CTRL Hacks Logo" />',
        projectLink: "https://ctrl-hacks.github.io/",
        projectGithub: "https://github.com/ctrl-hacks/ctrl-hacks.github.io"
    },
    {
        projectTitle: "Mecha Mayhem Website",
        projectDescription: "Co-developer of the official website for Canada’s largest robotics tournament. Now helping lead a team of developers to make it even better.",
        iconSVG: '<img class="lg:size-8 size-5" src="public/whitebull_nobg.svg" alt="Mecha Mayhem Logo" />',
        projectLink: "https://www.mechamayhem.ca/",
        projectGithub: "https://github.com/westmech/Mecha-Mayhem-Frontend-2025"
    },
    {
        projectTitle: "SeedPod",
        projectDescription: "A self-watering plant-pod powered by an Arduino and a gamified frontend, made in 24 hours. Won 1st Place at Code the Change YYC.",
        iconSVG: '<svg class="lg:size-8 size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.998 3V5C20.998 14.6274 15.6255 19 8.99805 19L5.24077 18.9999C5.0786 19.912 4.99805 20.907 4.99805 22H2.99805C2.99805 20.6373 3.11376 19.3997 3.34381 18.2682C3.1133 16.9741 2.99805 15.2176 2.99805 13C2.99805 7.47715 7.4752 3 12.998 3C14.998 3 16.998 4 20.998 3ZM12.998 5C8.57977 5 4.99805 8.58172 4.99805 13C4.99805 13.3624 5.00125 13.7111 5.00759 14.0459C6.26198 12.0684 8.09902 10.5048 10.5019 9.13176L11.4942 10.8682C8.6393 12.4996 6.74554 14.3535 5.77329 16.9998L8.99805 17C15.0132 17 18.8692 13.0269 18.9949 5.38766C17.6229 5.52113 16.3481 5.436 14.7754 5.20009C13.6243 5.02742 13.3988 5 12.998 5Z"></path></svg>',
        projectLink: "https://devpost.com/software/seedpod-empowering-individual-agriculture",
        projectGithub: "https://github.com/ericli3690/hack-the-change"
    },
    {
        projectTitle: "RubbleRecon",
        projectDescription: "A prototype inexpensive rover setup for low-cost automated reconnaissance in disaster situations. Won 3rd Place at STEMist Hacks II.",
        iconSVG: '<svg class="lg:size-8 size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>',
        projectLink: "https://devpost.com/software/rubblerecon",
        projectGithub: "https://github.com/GauthamV6002/StemistHacks2/tree/main"
    },
    {
        projectTitle: "The Trees",
        projectDescription: "A visualization platform for environmental donations, powered by React and MongoDB. Won 3rd place at Simplihacks 2022.",
        iconSVG: '<svg class="lg:size-8 size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 7.26214 17.9831 7.5207 17.9504 7.77457C19.77 8.80413 21 10.7575 21 13C21 16.3137 18.3137 19 15 19H13V22H11V19H8.5C5.46243 19 3 16.5376 3 13.5C3 11.2863 4.30712 9.37966 6.19098 8.50704C6.06635 8.02551 6 7.52039 6 7ZM7.00964 10.3319C5.82176 10.8918 5 12.1008 5 13.5C5 15.433 6.567 17 8.5 17H15C17.2091 17 19 15.2091 19 13C19 11.3056 17.9461 9.85488 16.4544 9.27234L15.6129 8.94372C15.7907 8.30337 16 7.67183 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 8.30783 8.6266 9.46903 9.60019 10.2005L8.39884 11.7995C7.85767 11.3929 7.38716 10.8963 7.00964 10.3319Z"></path></svg>',
        projectLink: "https://devpost.com/software/the-trees",
        projectGithub: "https://github.com/GauthamV6002/Simplihacks-2022-Server"
    },
    {
        projectTitle: "Auton Planner",
        projectDescription: "A Visual Path-to Code Editor that helps VEX Robotics teams visually plan out autonomous routes for VRC Over Under. Saw usage by 40+ teams at my High School.",
        iconSVG: '<svg class="lg:size-8 size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" /></svg>',
        projectLink: "https://gauthamv6002.github.io/Auton-Planner/",
        projectGithub: "https://github.com/GauthamV6002/Auton-Planner"
    },
    {
        projectTitle: "2024 IB Discord Bot",
        projectDescription: "A discord bot made to auto-moderate a server of 200+ IB students. Also had an wildly over-engineered virtual snowball-throwing system, just for fun :)",
        iconSVG: '<svg class="lg:size-8 size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.3034 5.33716C17.9344 4.71103 16.4805 4.2547 14.9629 4C14.7719 4.32899 14.5596 4.77471 14.411 5.12492C12.7969 4.89144 11.1944 4.89144 9.60255 5.12492C9.45397 4.77471 9.2311 4.32899 9.05068 4C7.52251 4.2547 6.06861 4.71103 4.70915 5.33716C1.96053 9.39111 1.21766 13.3495 1.5891 17.2549C3.41443 18.5815 5.17612 19.388 6.90701 19.9187C7.33151 19.3456 7.71356 18.73 8.04255 18.0827C7.41641 17.8492 6.82211 17.5627 6.24904 17.2231C6.39762 17.117 6.5462 17.0003 6.68416 16.8835C10.1438 18.4648 13.8911 18.4648 17.3082 16.8835C17.4568 17.0003 17.5948 17.117 17.7434 17.2231C17.1703 17.5627 16.576 17.8492 15.9499 18.0827C16.2789 18.73 16.6609 19.3456 17.0854 19.9187C18.8152 19.388 20.5875 18.5815 22.4033 17.2549C22.8596 12.7341 21.6806 8.80747 19.3034 5.33716ZM8.5201 14.8459C7.48007 14.8459 6.63107 13.9014 6.63107 12.7447C6.63107 11.5879 7.45884 10.6434 8.5201 10.6434C9.57071 10.6434 10.4303 11.5879 10.4091 12.7447C10.4091 13.9014 9.57071 14.8459 8.5201 14.8459ZM15.4936 14.8459C14.4535 14.8459 13.6034 13.9014 13.6034 12.7447C13.6034 11.5879 14.4323 10.6434 15.4936 10.6434C16.5442 10.6434 17.4038 11.5879 17.3825 12.7447C17.3825 13.9014 16.5548 14.8459 15.4936 14.8459Z"></path></svg>',
        projectLink: false,
        projectGithub: "https://github.com/GauthamV6002/2024-IB-Bot"
    },
]

const projectsList = document.getElementById("projectsList");

// Loop thru all projects & programmatically add to the frontend
for(const project of projectArchiveData) {
    

    const {projectTitle, projectDescription, iconSVG, projectLink, projectGithub} = project;

    const template = ` 
        <div class="flex flex-row gap-3 items-center justify-between lg:p-4 lg:border-[1.5px] lg:border-white/20 lg:rounded-md">
            <div class="flex flex-row justify-center items-center gap-2">
                ${iconSVG}
                    
                <div class="flex flex-col">
                    <a href="${projectLink ? projectLink : projectGithub}" target="_blank" class="text-lg w-fit">${projectTitle}</a>
                    <p class="text-white/70 lg:block hidden text-sm">${projectDescription}</p>
                </div>
            </div>
            <div class="flex flex-row gap-3">
            ${projectLink ? `<svg onclick="window.open('${projectLink}')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 lg:size-8 cursor-pointer hover:scale-110 transition-all"><path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path></svg>` : ""}
            <svg onclick="window.open('${projectGithub}')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 lg:size-8 cursor-pointer hover:scale-110 transition-all"><path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"></path></svg>
            </div>
        </div>`

    const d = document.createElement("div");
    d.innerHTML = template;

    projectsList.appendChild(d);
    
}
