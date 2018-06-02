import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import { Doughnut as DoughnutChart, Line as LineChart, Bar as BarChart } from 'react-chartjs-2';

export default class TabsExample extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        value: 'a',
        shouldRedraw: false
      };
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
  
    render() {
        let datadd = {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        };

      return (
        <Tabs
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
        >
          <Tab label="Tab A" value="a" className="Tab">
            <div>
              <h2>Controllable Tab A</h2>
              <DoughnutChart data={ datadd } redraw={ this.state.shouldRedraw } />
            </div>
          </Tab>
          <Tab label="Tab B" value="b" className="Tab">
            <div>
              <h2 >Controllable Tab B</h2>
              <LineChart data={ datadd } redraw={ this.state.shouldRedraw } />
            </div>
          </Tab>
          <Tab label="Tab C" value="c" className="Tab">
            <div>
              <h2>Controllable Tab C</h2>
              <BarChart data={ datadd } redraw={ this.state.shouldRedraw } />
            </div>
          </Tab>
        </Tabs>
      );
    }
  }