// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByCoverage from '../VaccinationCoverage'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationData: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(vaccinationDataApiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const last7DaysVaccination = data.last_7_days_vaccination.map(
        eachData => ({
          vaccineDate: eachData.vaccine_date,
          dose1: eachData.dose_1,
          dose2: eachData.dose_2,
        }),
      )
      const vaccinationByAge = data.vaccination_by_age.map(eachData => ({
        age: eachData.age,
        count: eachData.count,
      }))
      const vaccinationByGender = data.vaccination_by_gender.map(eachData => ({
        count: eachData.count,
        gender: eachData.gender,
      }))
      const updatedData = {
        last7DaysVaccination,
        vaccinationByAge,
        vaccinationByGender,
      }
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationByCoverage
          vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />

        <VaccinationByGender
          vaccinationGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-text">Something Went Wrong</h1>
    </div>
  )

  renderLoaderView = () => (
    <div className="loading-view" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderApiStatusViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-dashboard-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo"
            />
            <h1 className="logo-heading">Co-WIN</h1>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderApiStatusViews()}
        </div>
      </div>
    )
  }
}
export default CowinDashboard
