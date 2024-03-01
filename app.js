document.addEventListener("DOMContentLoaded", () => {
  console.log("loaded");
});
window.addEventListener("load", () => {
  let stageIndex = 0;
  let check;
  let stageAnswer;
  var numberOfStages;
  const fetchData = async () => {
    try {
      const response = await fetch("data.json");
      const data = await response.json();
      const stages = data.stages;
      numberOfStages = stages.length;
      console.log(numberOfStages);
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
      distance = marker1Position.distanceTo(marker2Position);

      // do what you want with the distance:
      let finaldistance = distance.toFixed(1) * 100000;
      document.getElementById("distance").innerHTML = finaldistance;
      // 使用范围来比较解决方案和距离
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
      await fetchData();
    }
  });

  fetchData();
});
