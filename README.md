# Lead Generation Weekly & Monthly Comparison Widget

This widget helps track **lead generation performance** in Zoho CRM.

## Features

- **Weekly % Change**: Compares leads generated in the current week vs. the previous week.
- **Monthly % Change**: Compares leads generated in the current month vs. the previous month.

## Table Structure

| Week | Jan | Feb | Mar | ... | Dec |
|------|-----|-----|-----|-----|-----|
| Week 1 | % vs Dec W4 | % vs Jan W4 | % vs Feb W4 | ... | ... |
| Week 2 | % vs W1 | % vs W1 | % vs W1 | ... | ... |
| Week 3 | % vs W2 | % vs W2 | % vs W2 | ... | ... |
| Week 4 | % vs W3 | % vs W3 | % vs W3 | ... | ... |
| Monthly % | % vs Dec | % vs Jan | % vs Feb | % vs Mar | % vs Apr | % vs May | % vs Jun | % vs Jul | % vs Aug | % vs Sep | % vs Oct | % vs Nov |

## Calculations

- **Weekly % Change Formula:** ((Leads in Current Week - Leads in Previous Week) / Leads in Previous Week) * 100

## Installation

1. Export the widget ZIP file.
2. In Zoho CRM, go to Setup → Developer Space → Widgets → Create New Widget.
3. Upload the ZIP file and configure permissions.
4. Add the widget as a Web Tab or embed it inside the Leads module.

## Usage

1. Open the widget from your CRM Web Tab or Leads module.
2. The table will automatically fetch and display lead generation data.
3. Review week-over-week and month-over-month growth trends.
4. Use insights to adjust marketing and sales strategies.

## Expected Outcome

- It should display a 12-month weekly breakdown of leads.
- It should calculate week-over-week % growth.
- It should calculate month-over-month % growth.
- It should help identify lead generation performance trends at a glance.

## Notes

- Week ranges are based on the Created Time field in Zoho CRM.
- If a week has no leads, the widget will display 0% or - depending on configuration.
- Data refresh is tied to the CRM's API fetch frequency.

