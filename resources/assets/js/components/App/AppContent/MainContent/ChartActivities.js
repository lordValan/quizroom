import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import { Doughnut as DoughnutChart, Line as LineChart, Bar as BarChart, Radar as RadarChart } from 'react-chartjs-2';
import { chartTemplate } from '../../../../utils/AppHelper'; 

export default class ChartActivities extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: 'a',
        shouldRedraw: false
      };

      this.categoriesData = this.getData(this.props.category_data);
      this.monthsData = this.getData(this.props.month_data);

      /* month average */
      this.monthAverData = {
        datasets: [{
          backgroundColor: chartTemplate.backgroundColor,
          borderColor: chartTemplate.borderColor,
          borderWidth: chartTemplate.borderWidth
        }]
      };
      this.monthAverData.labels = this.monthsData.labels;
      this.monthAverData.datasets[0].data = this.monthsData.average;

      /* month passed */
      this.monthPassData = {
        datasets: [{
          backgroundColor: chartTemplate.backgroundColor,
          borderColor: chartTemplate.borderColor,
          borderWidth: chartTemplate.borderWidth
        }]
      };
      this.monthPassData.labels = this.monthsData.labels;
      this.monthPassData.datasets[0].data = this.monthsData.passed;

      /* categories average */
      this.catAverData = {
        datasets: [{
          backgroundColor: chartTemplate.backgroundColor,
          borderColor: chartTemplate.borderColor,
          borderWidth: chartTemplate.borderWidth
        }]
      };
      this.catAverData.labels = this.categoriesData.labels;
      this.catAverData.datasets[0].data = this.categoriesData.average;

      /* categories passed */
      this.catPassData = {
        datasets: [{
          backgroundColor: chartTemplate.backgroundColor,
          borderColor: chartTemplate.borderColor,
          borderWidth: chartTemplate.borderWidth
        }]
      };
      this.catPassData.labels = this.categoriesData.labels;
      this.catPassData.datasets[0].data = this.categoriesData.passed;
    }
  
    handleChange(value) {
      this.setState({
        value: value,
        shouldRedraw: true
      });

      setTimeout(() => {
        this.setState({
          shouldRedraw: false
        });
      }, 300);
    };

    getData(dataArr) {
      let data = {
        'labels': [],
        'average': [],
        'passed': []
      };

      if(dataArr) {
        dataArr.forEach(element => {
          data.labels.push(element.label);
          data.average.push(element.average);
          data.passed.push(element.passed);
        });
      } else {
        return data;
      }

      return data;
    } 
    
    drawTabs() {
      return (
        <Tabs
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
        >
          <Tab label="Tab A" value="a" className="Tab">
            <div>
              <h2>Средняя оценка</h2>
              <p>Средняя оценка за каждый месяц (данные взяты за последние 5 месяцев)</p>
              <LineChart data={ this.monthAverData } redraw={ this.state.shouldRedraw } options={{legend: { display: false }, scales: chartTemplate.scales}} />              
            </div>
          </Tab>
          <Tab label="Tab B" value="b" className="Tab">
            <div>
              <h2>Пройдено тестов</h2>
              <p>Количество пройденных тестов за каждый месяц (данные взяты за последние 5 месяцев)</p>
              <DoughnutChart data={ this.monthPassData } redraw={ this.state.shouldRedraw } />
            </div>
          </Tab>
          <Tab label="Tab C" value="c" className="Tab">
            <div>
              <h2>Средняя оценка</h2>
              <p>Средняя оценка за все время по каждой из категорий</p>
              <BarChart data={ this.catAverData } redraw={ this.state.shouldRedraw } options={{legend: { display: false }, scales: chartTemplate.scales}} />
            </div>
          </Tab>
          <Tab label="Tab D" value="d" className="Tab">
            <div>
              <h2>Пройдено тестов</h2>
              <p>Количество пройденных тестов по каждой из категорий</p>
              <RadarChart data={ this.catPassData } redraw={ this.state.shouldRedraw } options={{legend: { display: false }}} />
            </div>
          </Tab>
        </Tabs>
      );
    }

    drawEmpty() {
      return <p>Вы не прошли ни одного теста :(</p>
    }
  
    render() {
      return this.props.tests_count > 0 ? this.drawTabs() : this.drawEmpty();
    }
  }