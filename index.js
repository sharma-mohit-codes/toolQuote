// Calculator logic
function equal() {
    let expr = resultBox.textContent;
    expr = expr.replace(/×/g, "*").replace(/÷/g, "/");
    try {
      // eslint-disable-next-line no-eval
      resultBox.textContent = eval(expr);
    } catch {
      resultBox.textContent = "Error";
    }
  }
  
  // capture keyboard globally but ignore when typing in inputs
  document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    // ignore when focused on an input or textarea (city / todo input)
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
  
    if (e.key === "Enter") {
      e.preventDefault();
      equal();
    } else if (e.key === "Backspace") {
      resultBox.textContent = resultBox.textContent.slice(0, -1);
    } else if ((e.key >= "0" && e.key <= "9") || (["-", "+", "*", "/", "%", "."].includes(e.key))) {
      resultBox.textContent += e.key;
    }
  });
  
  const resultBox = document.querySelector(".result");
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.textContent;
      if (val === "=") equal();
      else if (val === "⌫") resultBox.textContent = resultBox.textContent.slice(0, -1);
      else if (val === "AC") resultBox.textContent = "";
      else resultBox.textContent += val;
    });
  });
  
  // TO-DO JS
  function getHTML(text) {
    return `<div class="card">
              <div class="left">
                <input type="checkbox" class="tick">
                <p>${text}</p>
              </div>
              <button class="cross">X</button>
            </div>`;
  }
  
  let tasks = getTasks();
  render();
  
  const add = document.querySelector(".add");
  add.addEventListener("click", () => {
    const text = document.querySelector("#text");
    if (!text.value.trim()) {
      const hidden = document.querySelector(".hidden");
      hidden.classList.add("show");
      setTimeout(() => hidden.classList.remove("show"), 2000);
    } else {
      tasks.push({ text: text.value.trim(), done: false });
      saveTasks(tasks);
      render();
      text.value = "";
    }
  });
  
  function saveTasks(tasksArr) {
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
  }
  
  function getTasks() {
    const stored = localStorage.getItem("tasks");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      localStorage.removeItem("tasks");
      return [];
    }
  }
  
  function render() {
    const block = document.querySelector(".tasks");
    block.innerHTML = "";
    tasks.forEach((t) => block.innerHTML += getHTML(t.text));
  
    document.querySelectorAll(".tick").forEach((chk, i) => {
      chk.checked = !!tasks[i].done;
      chk.addEventListener("change", () => {
        tasks[i].done = chk.checked;
        saveTasks(tasks);
      });
    });
  
    document.querySelectorAll(".cross").forEach((btn, i) => {
      btn.addEventListener("click", () => {
        tasks.splice(i, 1);
        saveTasks(tasks);
        render();
      });
    });
  
    document.querySelectorAll(".left p").forEach((object, i) => {
      object.addEventListener("click", () => {
        tasks[i].done = !tasks[i].done;
        saveTasks(tasks);
        render();
      });
    });
  }
  
  // -------------------
  // Weather widget
// Weather widget - FIXED VERSION
(async () => {
    const KEY = "44dab527474811d0954fe6f842379fcf";
    const wrap = document.getElementById("weatherContainerWrapper");
    if (!wrap) return;
    
    const back = wrap.querySelector("#weatherBack");
    const loc = back.querySelector(".loc");
    const temp = back.querySelector(".temp .value");
    const desc = back.querySelector(".desc");
    const hum = back.querySelector(".hum");
    const wind = back.querySelector(".wind");
    const prec = back.querySelector(".prec");
    const hourly = back.querySelector("#hourlyContainer");
    const refresh = back.querySelector("#refreshWeather");
    const cityInput = back.querySelector("#cityInput");
  
    // Map weather codes to emojis
    const getWeatherEmoji = (iconCode) => {
      const emojiMap = {
        "01d": "☀️", "01n": "🌙",
        "02d": "🌤️", "02n": "🌤️",
        "03d": "☁️", "03n": "☁️",
        "04d": "☁️", "04n": "☁️",
        "09d": "🌧️", "09n": "🌧️",
        "10d": "🌧️", "10n": "🌧️",
        "11d": "⛈️", "11n": "⛈️",
        "13d": "❄️", "13n": "❄️",
        "50d": "🌫️", "50n": "🌫️"
      };
      return emojiMap[iconCode] || "🌤️";
    };
  
    const hourLabel = (dt) => 
      new Date(dt * 1000).toLocaleTimeString([], { hour: "numeric", hour12: true });
  
    const setQuote = (main) => {
      if (!wrap.querySelector(".quote-text")) return;
      const quote = wrap.querySelector(".quote-text");
      main = (main || "").toLowerCase();
      if (main.includes("cloud")) quote.textContent = "clouds bring calm and change";
      else if (main.includes("rain")) quote.textContent = "every drop writes a new story";
      else if (main.includes("clear")) quote.textContent = "sunlight is nature's highlighter";
      else if (main.includes("snow")) quote.textContent = "soft white hush of snowfall";
      else quote.textContent = "change, rhythm, and surprise.";
    };
  
    const renderHourly = (list) => {
      hourly.innerHTML = "";
      (list || []).slice(0, 8).forEach(item => {
        const hr = new Date(item.dt * 1000).toLocaleTimeString([], { 
          hour: "numeric", 
          hour12: true 
        });
        const icon = item.weather?.[0]?.icon || "01d";
        const emoji = getWeatherEmoji(icon);
        const t = Math.round(item.main?.temp ?? 0);
        const pop = Math.round((item.pop ?? 0) * 100);
        const humidity = item.main?.humidity ?? "--";
  
        const card = document.createElement("div");
        card.className = "hour-card";
        card.innerHTML = `
          <div class="hour">${hr}</div>
          <div style="font-size: 1.8rem;">${emoji}</div>
          <div class="h-temp">${t}°</div>
          <div style="color:#9aa4b2;font-size:.8rem;margin-top:6px;">
            P ${pop}% • H ${humidity}%
          </div>
        `;
        hourly.appendChild(card);
      });
    };
  
    const renderCurrent = (data) => {
      if (!data.main) return;
      
      temp.textContent = Math.round(data.main.temp);
      desc.textContent = data.weather?.[0]?.description || "—";
      hum.textContent = `H: ${data.main.humidity}%`;
      wind.textContent = `W: ${(data.wind?.speed ?? 0).toFixed(1)} m/s`;
      
      const precip = data.rain?.["1h"] 
        ? Math.round(data.rain["1h"] * 100) 
        : 0;
      prec.textContent = `P: ${precip}%`;
      
      setQuote(data.weather?.[0]?.main);
    };
  
    async function fetchCurrentAndForecast(lat, lon, cityName = "") {
      try {
        loc.textContent = cityName || "Loading weather…";
  
        // Fetch current weather
        const curRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`
        );
        if (!curRes.ok) throw new Error("Current weather fetch failed");
        const current = await curRes.json();
  
        // Fetch forecast
        const foreRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`
        );
        if (!foreRes.ok) throw new Error("Forecast fetch failed");
        const forecast = await foreRes.json();
  
        // Render current
        renderCurrent(current);
  
        // Render hourly
        renderHourly(forecast.list);
  
        // Update location name if not provided
        if (!cityName && current.name) {
          loc.textContent = current.name + (current.sys?.country ? `, ${current.sys.country}` : "");
        }
  
      } catch (err) {
        console.error("Weather fetch error:", err);
        loc.textContent = "Unable to load weather";
        temp.textContent = "--";
        desc.textContent = "--";
        hourly.innerHTML = `<div style="color:#ef9a9a;padding:8px">Error loading forecast</div>`;
      }
    };
  
    const fetchCity = async (q) => {
      try {
        loc.textContent = `Searching "${q}"…`;
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${KEY}`
        );
        if (!res.ok) throw new Error("Geocoding failed");
        
        const data = await res.json();
        if (!data?.length) {
          loc.textContent = "City not found";
          return;
        }
  
        const { lat, lon, name, country } = data[0];
        const cityLabel = `${name}${country ? ", " + country : ""}`;
        await fetchCurrentAndForecast(lat, lon, cityLabel);
  
      } catch (err) {
        console.error("City lookup error:", err);
        loc.textContent = "Search failed";
      }
    };
  
    const tryGeo = () => {
      if (!navigator.geolocation) {
        loc.textContent = "Geolocation not supported";
        return;
      }
  
      loc.textContent = "Detecting location…";
  
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          console.log("Geolocation detected:", lat, lon);
          
          // Try multiple reverse geocoding sources for accuracy
          let cityName = null;
  
          // Try OpenWeatherMap reverse geocoding first
          try {
            const res = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${KEY}`
            );
            if (res.ok) {
              const data = await res.json();
              console.log("OpenWeatherMap reverse geo:", data);
              if (data?.length) {
                // Get the most accurate result (usually first one)
                const best = data[0];
                cityName = `${best.name}${best.state ? ", " + best.state : ""}${best.country ? ", " + best.country : ""}`;
                console.log("City detected:", cityName);
              }
            }
          } catch (err) {
            console.warn("OpenWeatherMap reverse geocoding failed:", err);
          }
  
          // If still no city name, try getting it from current weather API
          if (!cityName) {
            try {
              const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`
              );
              if (res.ok) {
                const data = await res.json();
                if (data.name) {
                  cityName = `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}`;
                  console.log("City from weather API:", cityName);
                }
              }
            } catch (err) {
              console.warn("Weather API lookup failed:", err);
            }
          }
  
          // Fetch weather with detected city name
          await fetchCurrentAndForecast(lat, lon, cityName || "Your Location");
        },
        (err) => {
          console.warn("Geolocation error:", err);
          loc.textContent = "Permission denied — type a city";
        },
        { timeout: 15000, maximumAge: 300000, enableHighAccuracy: true }
      );
    };
  
    // Event listeners
    refresh.addEventListener("click", tryGeo);
    cityInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter" && cityInput.value.trim()) {
        fetchCity(cityInput.value.trim());
        cityInput.value = "";
      }
    });
  
    // Initial load - try to load from localStorage first, then geolocation
    const savedCity = localStorage.getItem("weatherCity");
    if (savedCity) {
      fetchCity(savedCity);
    } else {
      tryGeo();
    }
  })();