# **Traffic Watch**

Traffic Watch is a web application that provides real-time traffic cam images and weather information for selected locations in Singapore. 
It utilizes open-source data from data.gov.sg through the following APIs:

* Traffic Images API: Fetches traffic cam images for specified date and time.
* Weather Forecast API: Retrieves weather information for selected locations.

### Features

* Allows the user to choose a date and time and select a location.
* Displays a list of available traffic cam images for the selected date, time, and location.
* Shows detailed information about each traffic cam image, including the location, camera ID, and weather information.

### Prerequisites

* Node.js (v14 or higher) and npm installed on your machine.
* Docker and Docker Compose installed.
* Colima (optional) for container orchestration.

### Getting Started

1. Clone the repository: `git clone git@github.com:sridevs/traffic-watch.git`
2. Navigate to the project directory: `cd traffic-watch`
3. Start the application using Docker Compose: `docker-compose up` 
4. Open your browser and visit http://localhost:4000 to access the Traffic Watch app.

### Testing

To run the tests, use the following command: `npm test`

### Contributing

Contributions are welcome! If you'd like to contribute to Traffic Watch, please fork the repository and create a pull request with your proposed changes.

### License

The Traffic Watch app is open-source and released under the MIT License.