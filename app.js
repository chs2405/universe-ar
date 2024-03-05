AFRAME.registerComponent("foo", {
  init: function () {
    // This will be called after the entity has properly attached and loaded.
    gsap.to(".loading-page", { y: "-100%" });
  },
});
var tl = new TimelineMax({
  repeat: -1,
});

tl.staggerFromTo(".loading-dot", 0.5, { x: 0 }, { x: 60 }, -0.15);
gsap.from("#showText", { opacity: 0 }, +3);
window.addEventListener("load", () => {
  let stageIndex = 0;
  let check;
  let stageAnswer = 10000000;
  var numberOfStages;
  const fetchData = async () => {
    try {
      const response = await fetch("data.json");
      const data = await response.json();
      const stages = data.stages;
      numberOfStages = stages.length;
      const stage = stages[stageIndex];
      const stageName = stage.name;
      const planets = stage.planets;
      const answer = stage.answer;
      stageAnswer = answer;
      document.getElementById("finalD").innerHTML = answer;
      document.getElementById("stage").innerHTML = stageName;

      const planet1 = planets[0][0];
      const planet2 = planets[0][1];
      const planet1c = planets[1][0];
      const planet2c = planets[1][1];

      var planet1name = document.getElementsByClassName("p-box1");
      var planet2name = document.getElementsByClassName("p-box2");
      for (var i = planet1name.length - 1; i >= 0; i--) {
        planet1name[i].innerHTML = planet1c;
      }
      for (var i = planet2name.length - 1; i >= 0; i--) {
        planet2name[i].innerHTML = planet2c;
      }
      document.getElementById("planet1-model").removeAttribute("gltf-model");
      document
        .getElementById("planet1-model")
        .setAttribute("gltf-model", "#" + planet1 + "-asset");
      document.getElementById("planet2-model").removeAttribute("gltf-model");
      document
        .getElementById("planet2-model")
        .setAttribute("gltf-model", "#" + planet2 + "-asset");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const marker = document.querySelectorAll("a-marker");
  const marker1 = marker[0];
  const marker2 = marker[1];

  marker1.addEventListener("markerFound", () => {
    let marker1Position = marker1.object3D.position;
    let marker2Position = marker2.object3D.position;
    let distance = marker1Position.distanceTo(marker2Position);

    check = setInterval(() => {
      marker1Position = marker1.object3D.position;
      marker2Position = marker2.object3D.position;
      distance = marker1Position.distanceTo(marker2Position).toFixed(1) * 10;
      let numStr = stageAnswer.toString();
      let remainingDigits = numStr.substring(2);
      let finaldistance = parseInt(distance + remainingDigits);
      document.getElementById("distance").innerHTML = finaldistance;
      if (Math.abs(finaldistance - stageAnswer) <= 0.1) {
        gsap.to(".block", { y: 0 });
      }
    }, 100);
  });

  marker1.addEventListener("markerLost", () => {
    clearInterval(check);
  });
  marker2.addEventListener("markerLost", () => {
    clearInterval(check);
  });

  const nextButton = document.querySelector(".next-button");
  nextButton.addEventListener("click", async () => {
    stageIndex++;
    gsap.to(".block", { y: "-100%" });
    if (stageIndex === numberOfStages) {
      document.location = "finish.html";
    } else {
      console.log(stageIndex + " " + numberOfStages);
      await fetchData();
    }
  });

  fetchData();
});
