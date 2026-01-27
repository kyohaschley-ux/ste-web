// global variables
let equipeInfoArray;
const points = document.querySelectorAll(".metro-dot");
const points_hitbox = document.querySelectorAll(".metro-dot-hitbox");
const card_info = document.getElementById("card-info");
const connectorLine = document.getElementById('connector-line');
const lineDuration = 2;

const mapPage = document.getElementById("map-page");
const listPage = document.getElementById("list-page");

const mapButton = document.getElementById("map-button");
const listButton = document.getElementById("list-button");


// fetch json
async function fetchTeamInfo(){
    const info = await fetch("./info_equipe.json");
    const teamMembers = await info.json();
    return teamMembers;
}

//remove unused points
function removeUnusedPoints(validIds){
    points.forEach((dot) => {
        const currentId = dot.id;
        if(!validIds.has(currentId)){
            dot.style.display = 'none';
            const dotHitbox = document.querySelector(`.metro-dot-hitbox[id="${currentId}"]`);
            if (dotHitbox) dotHitbox.style.display = 'none';
        }
    });
}

//add event listener
function setupEventListeners(){
    points_hitbox.forEach(point => {
        point.addEventListener('mouseover', function() {
            const currentID = point.id;
            const member = equipeInfoArray.find(p => p.id == currentID);
            console.log(member.first_name + " " + member.last_name);
            
            if(member){
                updateCardInfo(member);
                const rect = point.getBoundingClientRect();
                const pointX = rect.left + rect.width / 2;
                const pointY = rect.top + rect.height / 2;
                const cardWidth = 240; 
                const cardHeight = 280;
                //card offset (at the top right of the card)
                let offsetX = 60;
                let offsetY = -140;
                
                //** The boundary check part was written with the help of the AI of the google browser (Gemini) **/
                // Boundary Check: If card goes off right edge, flip to left
                if (pointX + offsetX + cardWidth > window.innerWidth) {
                    offsetX = -(cardWidth + 60);
                }

                // Boundary Check: If card goes off top/bottom
                if (pointY + offsetY < 10) {
                    offsetY = 20; // Flip below dot if too high
                } else if (pointY + offsetY + cardHeight > window.innerHeight) {
                    offsetY = -(cardHeight - 20);
                }

                const cardX = pointX + offsetX;
                const cardY = pointY + offsetY;

                // card position
                card_info.style.left = `${cardX}px`;
                card_info.style.top = `${cardY}px`;
                card_info.style.display = "block";


                // make the card appear at the right side according to boundary check
                const lineTargetX = offsetX > 0 ? cardX : cardX + cardWidth;
                const lineTargetY = cardY + (cardHeight / 2);

                const dx = lineTargetX - pointX;
                const dy = lineTargetY - pointY;
                const length = Math.sqrt(dx * dx + dy * dy);

                connectorLine.setAttribute('x1', pointX);
                connectorLine.setAttribute('y1', pointY);
                connectorLine.setAttribute('x2', lineTargetX);
                connectorLine.setAttribute('y2', lineTargetY);
                connectorLine.style.transition = 'none';
                connectorLine.style.strokeDasharray = length;
                connectorLine.style.strokeDashoffset = length;
                connectorLine.getBoundingClientRect();

                requestAnimationFrame(() => {
                    card_info.classList.add('active');
                    connectorLine.style.transition = 'stroke-dashoffset 0.4s ease-out';
                    connectorLine.style.strokeDashoffset = "0";
                });
            }
        });
        point.addEventListener('mouseleave', function() {
        card_info.classList.remove('active');
        // Animation to hide the line
        connectorLine.style.strokeDashoffset = connectorLine.style.strokeDasharray;
        
        setTimeout(() => {
            if (!card_info.classList.contains('active')) {
                card_info.style.display = "none";
            }
        }, 300);
        });
    })
}

//update cardinfo
function updateCardInfo(member){
    const img = card_info.querySelector('img');
    img.src = `./src/image/team/${member.photo}`;
    img.onerror = () => {
        img.src = "./src/image/team/default.png";
    }
    card_info.querySelector('h2').textContent = member.first_name + " " + member.last_name;
    card_info.querySelector('h1').textContent = member.title;
    card_info.querySelector('h3').textContent = member.bio;
    const roles = card_info.querySelector('p');
    roles.innerHTML = '';
    member.roles.forEach(role => {
        const span = document.createElement('span');
        span.textContent = "#"+role;
        roles.appendChild(span);
    })

}

async function init() {
    //fetch team info
    equipeInfoArray = await fetchTeamInfo();

    //valid IDs
    const validIds = new Set(equipeInfoArray.map(p => p.id));

    //remove unused metro stations
    removeUnusedPoints(validIds);

    //event listener
    setupEventListeners();

    //add list values
    equipeInfoArray.forEach(member => {
        const newCard = document.createElement('div');
        newCard.classList.add("card-list");
        const image = document.createElement('img');
        image.src = "./src/image/team/"+member.photo;

        const rightPart = document.createElement('div');
        rightPart.classList.add("right-part");

        const name = document.createElement('h2');
        name.textContent = member.first_name + " " + member.last_name;
        const title = document.createElement('h1');
        title.textContent = member.title;

        const roles = document.createElement('div');
        roles.innerHTML = '';
        member.roles.forEach(role => {
            const span = document.createElement('span');
            span.textContent = "#"+role;
            roles.appendChild(span);
        })

        newCard.appendChild(image);
        rightPart.appendChild(name);
        rightPart.appendChild(title);
        rightPart.appendChild(roles);
        newCard.appendChild(rightPart);


        listPage.appendChild(newCard);
    });
    
    //point appear animation
    points.forEach((dot) => {
        const result = parseInt(dot.id.replace(/\D/g, ''), 10) || 0;
        dot.style.animationDelay = `${lineDuration + (result * 0.05)}s`;
    });

    //handle options buttons
    listButton.addEventListener('click', function () {
        mapPage.style.display = "none";
        listPage.style.display = "block";
        
        listButton.classList.add('active');
        mapButton.classList.remove('active');

    });
    mapButton.addEventListener('click', function () {
        listPage.style.display = "none";
        mapPage.style.display = "block";

        mapButton.classList.add('active');
        listButton.classList.remove('active');
    });

    
}

init();