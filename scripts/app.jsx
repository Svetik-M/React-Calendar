import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import TitleMenu from './components/title-menu';
import SidebarMenu from './components/sidebar-menu';
import EventsTable from './components/events-table';
import AuthorizationForm from './components/auth/auth';

import '../styles/style.scss';

const date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

class AppView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selDate: date,
      period: 'week',
      visEventForm: false,
    };

    this.changePeriod = this.changePeriod.bind(this);
    this.sidebarEventHandler = this.sidebarEventHandler.bind(this);
    this.hidingEventForm = this.hidingEventForm.bind(this);
  }

  changePeriod(event) {
    const { target } = event;

    if (target.id === 'day' || target.id === 'week' || target.id === 'month') {
      const { state } = this;
      state.period = target.id;
      this.setState(state);
    } else if (target.id === 'today') {
      const { state } = this;
      state.selDate = date;
      state.period = 'day';
      this.setState(state);
    } else if (target.id === 'prev-period' || target.id === 'next-period') {
      const year = this.state.selDate.getFullYear();
      const month = this.state.selDate.getMonth();
      const prevDate = this.state.selDate.getDate();
      let selectedDate;

      if (target.id === 'prev-period') {
        if (this.state.period === 'day') {
          selectedDate = new Date(year, month, prevDate - 1);
        } else if (this.state.period === 'week') {
          selectedDate = new Date(year, month, prevDate - 7);
        } else if (this.state.period === 'month') {
          selectedDate = new Date(year, month - 1, prevDate);
        }
      } else if (target.id === 'next-period') {
        if (this.state.period === 'day') {
          selectedDate = new Date(year, month, prevDate + 1);
        } else if (this.state.period === 'week') {
          selectedDate = new Date(year, month, prevDate + 7);
        } else if (this.state.period === 'month') {
          selectedDate = new Date(year, month + 1, prevDate);
        }
      }

      const { state } = this;
      state.selDate = selectedDate;
      this.setState(state);
    }
  }

  sidebarEventHandler(event) {
    const { target } = event;

    if (target.className.indexOf('curr-month') >= 0
            || target.className.indexOf('other-month') >= 0) {
      const { state } = this;
      state.selDate = new Date(+target.id);
      this.setState(state);
    } else if (target.parentElement.className === 'create-event'
                   || target.className === 'create-event') {
      const { state } = this;
      state.visEventForm = true;
      this.setState(state);
    }
  }

  hidingEventForm(e) {
    const { target } = e;
    if (target.className === 'button create') {
      const { state } = this;
      state.visEventForm = false;
      this.setState(state);
    }
  }

  render() {
    return (
      <div>
        <div onClick={this.changePeriod}>
          <TitleMenu selDate={this.state.selDate} period={this.state.period} />
        </div>
        <div className="page-body">
          <div onClick={this.sidebarEventHandler}>
            <SidebarMenu selDate={this.state.selDate} period={this.state.period} />
          </div>
          <div onClick={this.hidingEventForm}>
            <EventsTable
              selDate={this.state.selDate}
              period={this.state.period}
              visEventForm={this.state.visEventForm}
            />
          </div>
        </div>
      </div>
    );
  }
}

const routs = (
  <Router history={browserHistory}>
    <Route path="/user" component={AppView} />
    <Route path="/:form" component={AuthorizationForm} />
  </Router>
);

ReactDOM.render(routs, document.getElementById('content'));
