// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

class CowinDashboard extends Component {
  state = {
    dataLoaded: false,
    apiStatusSuccess: false,
    last7DaysVaccinationData: '',
    vaccinationByAge: '',
    vaccinationByGender: '',
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const options = {
      method: 'GET',
    }
    const response = await fetch(
      'https://apis.ccbp.in/covid-vaccination-data',
      options,
    )
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const last7DaysVaccinationData = fetchedData.last_7_days_vaccination.map(
        each => ({
          vaccineDate: each.vaccine_date,
          dose1: each.dose_1,
          dose2: each.dose_2,
        }),
      )
      this.setState({
        dataLoaded: true,
        apiStatusSuccess: true,
        last7DaysVaccinationData,
        vaccinationByAge: fetchedData.vaccination_by_age,
        vaccinationByGender: fetchedData.vaccination_by_gender,
      })
    } else {
      this.setState({dataLoaded: true, apiStatusSuccess: false})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Something Went Wrong</h1>
    </div>
  )

  renderSuccess = () => {
    const {
      last7DaysVaccinationData,
      vaccinationByAge,
      vaccinationByGender,
    } = this.state

    return (
      <>
        <VaccinationCoverage data={last7DaysVaccinationData} />
        <VaccinationByGender data={vaccinationByGender} />
        <VaccinationByAge data={vaccinationByAge} />
      </>
    )
  }

  render() {
    const {dataLoaded, apiStatusSuccess} = this.state

    return (
      <div className="page">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <h1 className="logo-name">Co-Win</h1>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        <div className="page-content">
          {!dataLoaded && this.renderLoader()}
          {dataLoaded && !apiStatusSuccess && this.renderFailure()}
          {dataLoaded && apiStatusSuccess && this.renderSuccess()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
