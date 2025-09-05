///For Pramilla Team - Lead Reports...


// Utility: format month as "MMM YYYY"
function formatMonth(dateObj) {
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun",
                        "Jul","Aug","Sep","Oct","Nov","Dec"];
    return monthNames[dateObj.getMonth()] + " " + dateObj.getFullYear();
}

// Generate all months of the current year
function getAllMonthsOfYear(year) {
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun",
                        "Jul","Aug","Sep","Oct","Nov","Dec"];
    return monthNames.map((m, i) => `${m} ${year}`);
}

// Recursive fetch to get all pages of Leads with filter
async function fetchAllLeads(page = 1, allData = []) {
    // Allowed Lead Source values
    let leadSources = [
        "Zoho Leads", "Zoho Partner", "Zoho CRM", "Zoho Partners 2024",
        "Zoho - Sutha", "Zoho - Hemanth", "Zoho - Sen", "Zoho - Audrey",
        "Zoho - Jacklyn", "Zoho - Adrian", "Zoho Partner Website", "Zoho - Chaitanya"
    ];

    // Allowed Zoho Services values
    let zohoServices = ["Desk", "Workplace", "Projects", "Mail"];

    // Build criteria string
    let criteria = `(Lead_Source:in:${leadSources.join(",")}) and (Zoho_Services:in:${zohoServices.join(",")})`;

    let resp = await ZOHO.CRM.API.searchRecords({
        Entity: "Leads",
        Type: "criteria",
        Query: criteria,
        per_page: 200,
        page: page
    });

    if (resp && resp.data) {
        allData = allData.concat(resp.data);
        if (resp.info && resp.info.more_records) {
            return fetchAllLeads(page + 1, allData); // fetch next page
        }
    }
    return allData;
}

// Group data by Month → Week
function groupLeadsByMonthWeek(leads) {
    let grouped = {};
    leads.forEach(lead => {
        if (lead.Created_Time) {
            let createdDate = new Date(lead.Created_Time);
            let monthKey = formatMonth(createdDate);
            let weekNumber = Math.ceil(createdDate.getDate() / 7);

            if (!grouped[monthKey]) grouped[monthKey] = {};
            grouped[monthKey][weekNumber] = (grouped[monthKey][weekNumber] || 0) + 1;
        }
    });
    return grouped;
}

// Render table with totals and colored % change
function renderTable(monthlyWeeklyCounts) {
    let table = document.querySelector("#leadsTable");
    let thead = table.querySelector("thead");
    let tbody = table.querySelector("tbody");

    // Clear old rows
    thead.innerHTML = "";
    tbody.innerHTML = "";

    // Generate full year months (Jan–Dec current year)
    const year = new Date().getFullYear();
    let months = getAllMonthsOfYear(year);

    // Header row
    let headerRow = "<tr><th>Week</th>";
    months.forEach(m => {
        headerRow += `<th>${m}</th>`;
    });
    headerRow += "</tr>";
    thead.innerHTML = headerRow;

    // Weeks 1–4
    for (let week = 1; week <= 4; week++) {
        let row = `<tr><td>Week ${week}</td>`;
        months.forEach(m => {
            let count = (monthlyWeeklyCounts[m] && monthlyWeeklyCounts[m][week]) || 0;

            // Calculate % change vs previous week
            let prevWeekCount = (week > 1) ? ((monthlyWeeklyCounts[m] && monthlyWeeklyCounts[m][week - 1]) || 0) : null;
            let percentHTML = "";
            if (prevWeekCount && prevWeekCount > 0) {
                let change = (((count - prevWeekCount) / prevWeekCount) * 100).toFixed(1);
                let color = change > 0 ? "green" : (change < 0 ? "red" : "gray");
                percentHTML = ` <span style="color:${color};">(${change > 0 ? "+" : ""}${change}%)</span>`;
            } else if (week > 1) {
                percentHTML = ` <span style="color:gray;">(0%)</span>`;
            }

            row += `<td>${count}${percentHTML}</td>`;
        });
        row += "</tr>";
        tbody.innerHTML += row;
    }

    // Totals row
    let totalRow = `<tr><td><strong>Total</strong></td>`;
    months.forEach((m, i) => {
        let total = monthlyWeeklyCounts[m] 
            ? Object.values(monthlyWeeklyCounts[m]).reduce((a, b) => a + b, 0) 
            : 0;

        // Compare total with previous month
        let percentHTML = "";
        if (i > 0) {
            let prevMonth = months[i - 1];
            let prevTotal = monthlyWeeklyCounts[prevMonth] 
                ? Object.values(monthlyWeeklyCounts[prevMonth]).reduce((a, b) => a + b, 0) 
                : 0;

            if (prevTotal > 0) {
                let change = (((total - prevTotal) / prevTotal) * 100).toFixed(1);
                let color = change > 0 ? "green" : (change < 0 ? "red" : "gray");
                percentHTML = ` <span style="color:${color};">(${change > 0 ? "+" : ""}${change}%)</span>`;
            } else {
                percentHTML = ` <span style="color:gray;">(0%)</span>`;
            }
        }

        totalRow += `<td><strong>${total}${percentHTML}</strong></td>`;
    });
    totalRow += "</tr>";
    tbody.innerHTML += totalRow;

    // Footer note
    document.querySelector("#footerNote").innerText =
        `Leads grouped by month and week for ${year}, filtered by Lead Source & Zoho Services.`;
}

// Main
ZOHO.embeddedApp.on("PageLoad", async function(data) {
    console.log("Page Data:", data);
    let allLeads = await fetchAllLeads(); // fetch filtered leads
    console.log("Total Leads Fetched (Filtered):", allLeads.length);

    let monthlyWeeklyCounts = groupLeadsByMonthWeek(allLeads);
    renderTable(monthlyWeeklyCounts);
});

ZOHO.embeddedApp.init();
