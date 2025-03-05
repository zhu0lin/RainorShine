import axios from "axios"
import 'dotenv/config'
import express from "express"
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
    const getCurrentYear = () => new Date().getFullYear();
    res.render("index.ejs", { weatherDataObj: "No data yet", year: getCurrentYear() });
});

app.post("/submit", async (req, res) => {
    const getCurrentYear = () => new Date().getFullYear();
        const requestedLocation = req.body.location;

        try {
            const response = await axios.get(`https://api.weatherbit.io/v2.0/current?city=${requestedLocation}&postal_code=${requestedLocation}&units=I&key=${process.env.API_KEY}`);
            const result = response.data;
            const weatherData = result.data[0]; 
            const weatherDataObj = {
                appTemp: weatherData.app_temp,
                description: weatherData.weather.description,
                icon: `https://www.weatherbit.io/static/img/icons/${weatherData.weather.icon}.png`,
                windSpd: weatherData.wind_spd,
                rh: weatherData.rh,
                pres: weatherData.pres
            };
            res.render("index.ejs", { weatherDataObj , year: getCurrentYear() });
        }
        catch (error) {
            const errorMessage = error.response ? error.response.data : "An error occurred while fetching the weather for the entered location.";
            res.render("index.ejs", { weatherDataObj: errorMessage, year: getCurrentYear() });
        }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})