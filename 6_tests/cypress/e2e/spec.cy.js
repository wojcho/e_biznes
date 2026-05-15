function login(username, password) {
  cy.visit("https://opensource-demo.orangehrmlive.com");
  cy.get('#app [name="username"]').click();
  cy.get('#app [name="username"]').type(username);
  cy.get('#app [name="password"]').click();
  cy.get('#app [name="password"]').type(password);
  cy.get('#app button.oxd-button').click();
}

function createUser(firstName, middleName, lastName) {
  cy.get('#app a[href="/web/index.php/pim/viewPimModule"]').click();
  cy.get('#app li:nth-child(3) a.oxd-topbar-body-nav-tab-item').click();
  cy.get('#app [name="firstName"]').click();
  cy.get('#app [name="firstName"]').type(firstName);
  cy.get('#app [name="middleName"]').click();
  cy.get('#app [name="middleName"]').type(middleName);
  cy.get('#app [name="lastName"]').click();
  cy.get('#app [name="lastName"]').type(lastName);
  cy.get('#app input.oxd-input--focus').click();
  cy.get('#app button.orangehrm-left-space').click();
}

function addUser(firstName, middleName, lastName, username, password) {
  cy.get('#app a[href="/web/index.php/admin/viewAdminModule"]').click();
  cy.get('#app div.orangehrm-header-container button.oxd-button').click();
  // Role - select "Admin"
  cy.get('#app div:nth-child(1) > .oxd-select-text-input').eq(0).type('{downarrow}{enter}', { force: true });
  // Status - select "Enabled"
  cy.get('#app div:nth-child(3) > div.oxd-input-group > div:nth-child(2) > .oxd-select-wrapper')
    .within(() => {
      cy.get('.oxd-select-text').click({ force: true });
    });
  cy.contains('.oxd-select-option, div', 'Enabled').click({ force: true });
  cy.get('#app div.user-password-cell input.oxd-input').type(password, {force: true});
  cy.get('#app div:nth-child(2) > div.oxd-input-group > div:nth-child(2) > input.oxd-input').type(password, {force: true});
  cy.get('#app input.oxd-input--focus').click();
  cy.get('#app input[placeholder="Type for hints..."]').click();
  cy.get('#app input[placeholder="Type for hints..."]').type(firstName + " " + middleName + " " + lastName).wait(3000).type('{downarrow}{enter}');
  cy.get('#app div:nth-child(4) input.oxd-input').type(username);
  cy.get('#app button.orangehrm-left-space').click();
}

describe("20 Tests", () => {
  it("0 - Login with correct credentials works", () => {
    login("Admin", "admin123");
    cy.get('#app span.oxd-userdropdown-tab').should('be.visible');
    cy.get('#app p.orangehrm-attendance-card-state').should('be.visible');
    cy.get('#app a.active').should('be.visible');
    cy.get('#app a.oxd-brand').should('be.visible');
    cy.get('#app h6.oxd-text').should('be.visible');
    cy.get('#app h6.oxd-text').should('have.text', 'Dashboard');
    cy.get('#app div:nth-child(1) > div.oxd-sheet > div.orangehrm-dashboard-widget-header > div.orangehrm-dashboard-widget-name > p.oxd-text').should('have.text', 'Time at Work');
  });

  it("1 - Login with incorrect credentials does not work", () => {
    login("wrong", "wrong");
    cy.get('#app div.oxd-alert-content').should('have.text', 'Invalid credentials');
    cy.get('#app div.oxd-sheet p:nth-child(1)').should('have.text', 'Username : Admin');
    cy.get('#app div.oxd-sheet p:nth-child(2)').should('have.text', 'Password : admin123');
    cy.get('#app img[alt="company-branding"]').should('be.visible');
    cy.get('#app button.oxd-button').should('be.visible');
    cy.get('#app button.oxd-button').should('have.text', ' Login ');
  });

  it("2 - About displays proper system name", () => {
    login("Admin", "admin123");
    cy.get('#app i.bi-caret-down-fill').click();
    cy.get('#app a[href="#"]').click();
    cy.get('#app div.orangehrm-about div:nth-child(2) p.oxd-text').click();
    cy.get('#app div.orangehrm-about div:nth-child(2) p.oxd-text').should('have.text', 'OrangeHRM');
    cy.get('#app h6.orangehrm-main-title').should('have.text', 'About');
    cy.get('#app div.orangehrm-about div:nth-child(1) p.oxd-text').should('have.text', 'Company Name: ');
    cy.get('#app div:nth-child(6) > p.oxd-text')
      .invoke('text')
      .then(text => {
        const n = Number(text.trim());
        expect(n).to.be.at.least(0);
      });
  });

  it("3 - Employee has proper name in timesheet", () => {
    login("Admin", "admin123");
    const firstName = "Jan";
    const middleName = "Bronisław";
    const lastName = "Kowalski";
    createUser(firstName, middleName, lastName);
    cy.get('#app a[href="/web/index.php/time/viewTimeModule"]').click();
    cy.get('#app input[placeholder="Type for hints..."]').clear().type(firstName + " " + middleName + " " + lastName).click();
    cy.get('#app input[placeholder="Type for hints..."]')
      .clear()
      .type(`${firstName} ${middleName} ${lastName}`)
      .should('have.value', `${firstName} ${middleName} ${lastName}`)
      .wait(3000)
      .type('{downarrow}{enter}');
    cy.get('#app button.orangehrm-left-space').click();
    cy.get('#app h6.orangehrm-main-title')
      .should('have.text', `Timesheet for ${firstName + " " + lastName}`);
    cy.get('#app h6.orangehrm-main-title').should('be.visible');
    cy.get('#app p.orangehrm-timeperiod-title').should('be.visible');
    cy.get('#app button.--prev i.oxd-icon').should('be.visible');
    cy.get('#app input[placeholder="yyyy-dd-mm"]').should('be.visible');
    cy.get('#app button.--next').should('be.visible');
    cy.get('#app div.oxd-alert-content').should('be.visible');
    cy.get('#app p.oxd-alert-content-text').should('have.text', 'No Timesheets Found');
  });

  it("4 - Admin has user role admin", () => {
    login("Admin", "admin123");
    cy.get('#app a[href="/web/index.php/admin/viewAdminModule"]').click();
    cy.get('#app a.active').click();
    cy.get('#app div:nth-child(2) > div.oxd-input-group > div:nth-child(2) > div.oxd-select-wrapper > div.oxd-select-text > div.oxd-select-text--after > i.oxd-icon').click();
    cy.get('#app button.orangehrm-left-space').click();
    cy.get('#app div.oxd-table-body div:nth-child(1) div.oxd-table-row div:nth-child(3) div').click();
    cy.get('#app div.oxd-table-body div:nth-child(1) div.oxd-table-row div:nth-child(3) div').click();
  });

  it("5 - Posting messages on newsfeed works", () => {
    login("Admin", "admin123");
    const postContent = 'Sample post text is being written here';
    cy.get('a[href="/web/index.php/buzz/viewBuzz"]').click();

    cy.get('textarea.oxd-buzz-post-input') // kludge because that textarea was being reset after normal typing
      .filter(':visible')
      .then(($el) => {
        const el = $el[0];

        el.value = postContent;

        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });

    cy.get('textarea.oxd-buzz-post-input')
      .filter(':visible')
      .should('have.value', postContent);

    cy.contains('button', 'Post')
      .should('not.be.disabled')
      .click();

    cy.get('#app div:nth-child(1) > div.oxd-sheet > div:nth-child(2) > div > p.orangehrm-buzz-post-body-text').should('have.text', postContent);
    cy.get('#app div:nth-child(1) > div.oxd-sheet > div.orangehrm-buzz-post > div.orangehrm-buzz-post-header > div.orangehrm-buzz-post-header-details > div.orangehrm-buzz-post-header-text > p.orangehrm-buzz-post-time').should('be.visible');
    cy.get('#app div:nth-child(1) > div.oxd-sheet > div.orangehrm-buzz-post > div.orangehrm-buzz-post-header > div.orangehrm-buzz-post-header-details > div.orangehrm-buzz-post-header-text > p.orangehrm-buzz-post-emp-name').should('be.visible');
    cy.get('#app div:nth-child(1) > div.oxd-sheet > div.orangehrm-buzz-post > div.orangehrm-buzz-post-header > div.orangehrm-buzz-post-header-details > div.orangehrm-buzz-profile-image > img').should('be.visible');
    cy.get('#app div:nth-child(1) > div.oxd-sheet > div:nth-child(2) > div > p.orangehrm-buzz-post-body-text').should('be.visible');
    cy.get('#app div:nth-child(1) > div.oxd-sheet > div.orangehrm-buzz-post > div.orangehrm-buzz-post-header > div.orangehrm-buzz-post-header-config > li > button.oxd-icon-button > i.oxd-icon').should('be.visible');
    cy.get('#app div:nth-child(1) > div.oxd-sheet > div.orangehrm-buzz-post-footer > div.orangehrm-buzz-stats > div:nth-child(1) > p.oxd-text').should('be.visible');
    cy.get('#app div:nth-child(1) > div.oxd-sheet > div.orangehrm-buzz-post-footer > div.orangehrm-buzz-post-actions > button:nth-child(3)').should('be.enabled');
    cy.get('#app div:nth-child(1) > div.oxd-sheet > div.orangehrm-buzz-post-footer > div.orangehrm-buzz-post-actions > button:nth-child(2)').should('be.enabled');
  });

  it("6 - Recruitment", () => {
    login("Admin", "admin123");
    const firstName = "aaa";
    const middleName = "bbb";
    const lastName = "ccc";
    const email = "aaa@bbb.com";
    const notes = 'notes';
    cy.get('#app a[href="/web/index.php/recruitment/viewRecruitmentModule"]').click();
    cy.get('#app a.active').click();
    cy.get('#app div.orangehrm-header-container button.oxd-button').click();
    cy.get('#app [name="firstName"]').click();
    cy.get('#app [name="firstName"]').type(firstName);
    cy.get('#app [name="middleName"]').click();
    cy.get('#app [name="middleName"]').type(middleName);
    cy.get('#app [name="lastName"]').click();
    cy.get('#app [name="lastName"]').type(lastName);
    cy.get('#app div:nth-child(3) > div.orangehrm-full-width-grid > div:nth-child(1) > div.oxd-input-group > div:nth-child(2) > input.oxd-input').click();
    cy.get('#app div:nth-child(3) > div.orangehrm-full-width-grid > div:nth-child(1) > div.oxd-input-group > div:nth-child(2) > input.oxd-input').type(email);
    cy.get('#app div:nth-child(3) > div.orangehrm-full-width-grid > div:nth-child(1) > div.oxd-input-group > div:nth-child(2) > input.oxd-input').click();
    cy.get('#app textarea.oxd-textarea').click();
    cy.get('#app textarea.oxd-textarea').type(notes);
    cy.get('#app i.bi-check').click();
    cy.get('#app input[type="checkbox"]').check();
    cy.get('#app button.orangehrm-left-space').click();
    cy.get('#app [name="firstName"]').should('have.value', firstName);
    cy.get('#app [name="middleName"]').should('have.value', middleName);
    cy.get('#app [name="lastName"]').should('have.value', lastName);
    cy.get('#app [name="firstName"]').should('be.visible');
    cy.get('#app [name="middleName"]').should('be.visible');
    cy.get('#app [name="lastName"]').should('be.visible');
    cy.get('#app div:nth-child(3) > div.orangehrm-full-width-grid > div:nth-child(1) > div.oxd-input-group > div:nth-child(2) > input.oxd-input').should('have.value', 'aaa@bbb.com');
    cy.get('#app textarea.oxd-textarea').should('have.value', notes);
  });

  it("7 - Add candidate", () => {
    login("Admin", "admin123");
    const firstName = "Jan";
    const middleName = "Bronisław";
    const lastName = "Kowalski";
    const email = "kowalski@example.com";
    cy.get('#app a[href="/web/index.php/recruitment/viewRecruitmentModule"]').click();
    cy.get('#app a.active').click();
    cy.get('#app div.orangehrm-header-container button.oxd-button').click();
    cy.get('#app [name="firstName"]').type(firstName);
    cy.get('#app [name="middleName"]').type(middleName);
    cy.get('#app [name="lastName"]').type(lastName);
    cy.get('#app div:nth-child(3) > div.orangehrm-full-width-grid > div:nth-child(1) > div.oxd-input-group > div:nth-child(2) > input.oxd-input').type(email);
    cy.get('#app input.oxd-input--focus').click();
    cy.get('#app button.orangehrm-left-space').click();
    cy.get('#oxd-toaster_1 div.oxd-toast').should('be.visible');
    cy.get('#oxd-toaster_1 p.oxd-text--toast-title').should('have.text', 'Success');
    cy.get('#app [name="firstName"]').should('have.value', 'Jan');
    cy.get('#app [name="middleName"]').should('have.value', 'Bronisław');
    cy.get('#app [name="lastName"]').should('have.value', 'Kowalski');
    cy.get('#app div:nth-child(3) > div.orangehrm-full-width-grid > div:nth-child(1) > div.oxd-input-group > div:nth-child(2) > input.oxd-input').should('have.value', 'kowalski@example.com');
    cy.get('#app div:nth-child(1) > div.oxd-input-group > div:nth-child(2) > p.oxd-text').should('have.text', 'Jan Bronisław Kowalski');
  });

  it("8 - Search works", () => {
    login("Admin", "admin123");
    cy.get('#app input[placeholder="Search"]').click();
    cy.get('#app input.oxd-input--focus').type('admin');
    cy.get('#app span.oxd-main-menu-item--name').should('have.text', 'Admin');
    cy.get('#app svg.oxd-main-menu-item--icon').should('be.visible');
    cy.get('#app input.oxd-input').click();
    cy.get('#app input.oxd-input').clear();
    cy.get('#app input.oxd-input').type('perf');
    cy.get('#app a.oxd-main-menu-item').should('have.text', 'Performance');
    cy.get('#app div.oxd-main-menu-search').click();
    cy.get('#app input.oxd-input').click();
    cy.get('#app input.oxd-input').clear();
    cy.get('#app input.oxd-input').type('dir');
    cy.get('#app a.oxd-main-menu-item').should('have.text', 'Directory');
  });

  it("9 - Directory item has image", () => {
    login("Admin", "admin123");
    cy.get('#app a[href="/web/index.php/directory/viewDirectory"]').click();
    cy.get('#app div:nth-child(1) > div.oxd-sheet > p.orangehrm-directory-card-header').should('be.visible');
    cy.get('#app div:nth-child(1) > div.oxd-sheet > div.orangehrm-profile-picture > img.orangehrm-profile-picture-img').should('be.visible');
    cy.get('#app h5.oxd-table-filter-title').should('have.text', 'Directory');
  });

  it("10 - Maintenance can cancel and go back", () => {
    login("Admin", "admin123");
    cy.get('#app a.active').click();
    cy.get('#app a[href="/web/index.php/maintenance/viewMaintenanceModule"]').click();
    cy.get('#app h6.orangehrm-admin-access-title').should('have.text', 'Administrator Access');
    cy.get('#app toast-message.oxd-text').should('have.text', 'You have requested to access a critical Administrator function in OrangeHRM and are required to validate your credentials below');
    cy.get('#app [name="username"]').should('have.value', 'Admin');
    cy.get('#app button.oxd-button--ghost').should('have.text', ' Cancel ');
    cy.get('#app button.oxd-button--ghost').should('be.visible');
    cy.get('#app button.oxd-button--ghost').should('be.enabled');
    cy.get('#app button.oxd-button--ghost').click();
    cy.get('#app a.active').should('have.text', 'Dashboard');
    cy.get('#app a.active').should('be.visible');
  });

  it("11 - Bad search has empty results", () => {
    login("Admin", "admin123");
    cy.get('#app input.oxd-input').click();
    cy.get('#app input.oxd-input').type('aaaaaaaaaaaaaaa');
    cy.get('#app div.oxd-sidepanel-body').should('have.class', 'oxd-sidepanel-body');
    cy.get('#app div.oxd-sidepanel-body').should('be.visible');
    cy.get('#app ul.oxd-main-menu')
      .children()
      .should('have.length', 0);
  });
  
  it("12 - Can add a user", () => {
    login("Admin", "admin123");
    const firstName = "Jan";
    const middleName = "Bronisław";
    const lastName = "Kowalski";
    const username = "janbronislawkowalski" + Math.random();
    const password = "aA1!aaaa";
    createUser(firstName, middleName, lastName);
    addUser(firstName, middleName, lastName, username, password);
    cy.get('#app a[href="/web/index.php/admin/viewAdminModule"]').click();
    cy.get('#app div:nth-child(2) > input.oxd-input').click();
    cy.get('#app input.oxd-input--focus').type(username);
    cy.get('#app button.orangehrm-left-space').click();

    cy.get('#app div.oxd-table-card div:nth-child(2) div').should('have.text', username);
    cy.get('#app div.oxd-table-card div:nth-child(2) div').should('be.visible');
    cy.get('#app div.oxd-table-card div:nth-child(3) div').should('have.text', 'Admin');
    cy.get('#app div.oxd-table-card div:nth-child(3) div').should('be.visible');
    cy.get('#app div.oxd-table-card div:nth-child(4) div').should('have.text', firstName + " " + lastName);
    cy.get('#app div.oxd-table-card div:nth-child(4) div').should('be.visible');
    cy.get('#app div.oxd-table-card div:nth-child(5) div').should('have.text', 'Enabled');
    cy.get('#app div.oxd-table-card div:nth-child(5) div').should('be.visible');
    cy.get('#app i.bi-trash').should('be.visible');
    cy.get('#app i.bi-pencil-fill').should('be.visible');
    cy.get('#app div.orangehrm-vertical-padding span.oxd-text').should('have.text', '(1) Record Found');
    cy.get('#app div.orangehrm-vertical-padding span.oxd-text').should('be.visible');
  });

  it("13 - Adding a user with duplicate username causes only one copy to be added", () => {
    login("Admin", "admin123");
    const firstName = "Grzegorz";
    const middleName = "Stanisław";
    const lastName = "Brzęczyszczykiewicz";
    const username = "brzeczyszczykiewicz" + Math.random();
    const password = "aA1!aaaa";
    createUser(firstName, middleName, lastName);
    addUser(firstName, middleName, lastName, username, password);
    addUser(firstName, middleName, lastName, username, password);
    cy.get('#app a[href="/web/index.php/admin/viewAdminModule"]').click();
    cy.get('#app div:nth-child(2) > input.oxd-input').click();
    cy.get('#app input.oxd-input--focus').type(username);
    cy.get('#app button.orangehrm-left-space').click();

    cy.get('#app div.oxd-table-card div:nth-child(2) div').should('have.text', username);
    cy.get('#app div.oxd-table-card div:nth-child(2) div').should('be.visible');
    cy.get('#app div.oxd-table-card div:nth-child(3) div').should('have.text', 'Admin');
    cy.get('#app div.oxd-table-card div:nth-child(3) div').should('be.visible');
    cy.get('#app div.oxd-table-card div:nth-child(4) div').should('have.text', firstName + " " + lastName);
    cy.get('#app div.oxd-table-card div:nth-child(4) div').should('be.visible');
    cy.get('#app div.oxd-table-card div:nth-child(5) div').should('have.text', 'Enabled');
    cy.get('#app div.oxd-table-card div:nth-child(5) div').should('be.visible');
    cy.get('#app i.bi-trash').should('be.visible');
    cy.get('#app i.bi-pencil-fill').should('be.visible');
    cy.get('#app div.orangehrm-vertical-padding span.oxd-text').should('have.text', '(1) Record Found');
    cy.get('#app div.orangehrm-vertical-padding span.oxd-text').should('be.visible');
  });

  it("14 - Removing all users", () => {
    login("Admin", "admin123");
    const firstName = "Kazimierz";
    const middleName = "Jerzy";
    const lastName = "Kamiński";
    const username = "kkaminski" + Math.random();
    const password = "aA1!aaaa";
    createUser(firstName, middleName, lastName);
    addUser(firstName, middleName, lastName, username, password);

    cy.get('#app a[href="/web/index.php/admin/viewAdminModule"]').click();
    cy.get('#app div.oxd-table-row > div:nth-child(1) > div.oxd-checkbox-wrapper > label > span.oxd-checkbox-input > i.bi-check').click();
    cy.get('#app div.oxd-table-row > div:nth-child(1) > div.oxd-checkbox-wrapper > label > input').check();
    cy.get('#app button.orangehrm-horizontal-margin').click();
    cy.get('#app button.orangehrm-button-margin.oxd-button--label-danger').click();
    cy.get('#app div.orangehrm-vertical-padding span.oxd-text').should('have.text', '(1) Record Found');
    cy.get('#app div.oxd-table-card div:nth-child(2) div').should('have.text', 'Admin');
    cy.get('#app div.oxd-table-card div:nth-child(3) div').should('have.text', 'Admin');
    cy.get('#app div.oxd-table-card div:nth-child(5) div').should('have.text', 'Enabled');
    cy.get('#app i.bi-trash').should('be.visible');
    cy.get('#app i.bi-pencil-fill').should('be.visible');
  });

  it("15 - Name required for claim", () => {
    login("Admin", "admin123");
    const firstName = "Jurand";
    const middleName = "Mścisław";
    const lastName = "ze Spychowa";
    const username = "jurand" + Math.random();
    const password = "aA1!aaaa";
    createUser(firstName, middleName, lastName);
    addUser(firstName, middleName, lastName, username, password);
    cy.get('#app a[href="/web/index.php/claim/viewClaimModule"]').click();
    cy.get('#app div.orangehrm-header-container button.oxd-button').click();
    cy.get('#app input[placeholder="Type for hints..."]').click();
    cy.get('#app input[placeholder="Type for hints..."]').type(firstName + " " + middleName + " " + lastName).wait(3000).type('{downarrow}{enter}');
    cy.get('#app div:nth-child(2) > div.oxd-input-group > div:nth-child(2) > div.oxd-select-wrapper > div.oxd-select-text').click();
    cy.get('#app button.orangehrm-left-space').click();
    cy.get('#app div:nth-child(1) > div.oxd-input-group > span.oxd-text').should('have.text', 'Required');
    cy.get('#app div:nth-child(2) > div.oxd-input-group > span.oxd-text').should('have.text', 'Required');
    cy.get('#app div:nth-child(2) > div.oxd-input-group > div:nth-child(2) > div.oxd-select-wrapper > div.oxd-select-text').should('have.class', 'oxd-select-text--error');
    cy.get('#app div:nth-child(1) > div.oxd-input-group > div:nth-child(2) > div.oxd-select-wrapper > div.oxd-select-text').should('have.class', 'oxd-select-text--error');
  });

  it("16 - Report name required", () => {
    login("Admin", "admin123");
    cy.get('#app a[href="/web/index.php/pim/viewPimModule"]').click();
    cy.get('#app a[href="/web/index.php/pim/viewPimModule"]').click();
    cy.get('#app nav.oxd-topbar-body-nav li:nth-child(4)').click();
    cy.get('#app div.orangehrm-header-container button.oxd-button').click();
    cy.get('#app button.orangehrm-left-space').click();
    cy.get('#app span.oxd-input-field-error-message').should('have.text', 'Required');
    cy.get('#app input.oxd-input--error').should('have.class', 'oxd-input--error');
  });

  it("17 - Adding new report", () => {
    login("Admin", "admin123");
    const reportName = 'report' + Math.random();
    cy.get('#app a[href="/web/index.php/pim/viewPimModule"]').click();
    cy.get('#app nav.oxd-topbar-body-nav li:nth-child(4)').click();
    cy.get('#app div.orangehrm-header-container button.oxd-button').click();
    cy.get('#app input[placeholder="Type here ..."]').click();
    cy.get('#app input.oxd-input--focus').type(reportName);
    
    cy.get('#app div:nth-child(5) div:nth-child(1) div.oxd-input-group div:nth-child(2) div.oxd-select-wrapper div.oxd-select-text div.oxd-select-text-input').click().type('{downarrow}{enter}', { force: true });
    cy.get('#app div.oxd-select-text--focus div.oxd-select-text-input').click().type('{downarrow}{enter}', { force: true });
    cy.get('#app div:nth-child(5) i.bi-plus').click();
    
    cy.get('#app button.orangehrm-left-space').click();

    cy.get('#app h6.orangehrm-main-title').should('have.class', 'oxd-text');
    cy.get('#app div.orangehrm-card-container').click();
    cy.get('#app div.orangehrm-card-container').click();
    cy.get('#app div.orangehrm-card-container').click();
    cy.get('#app h6.orangehrm-main-title').click();
    cy.get('#app h6.orangehrm-main-title').should('have.text', reportName);
    cy.get('#app div[data-rgcol="0"][canresize=""] div.header-content').should('have.text', 'Employee Id');
    cy.get('#app div[data-rgcol="1"][canresize=""] div.header-content').should('have.text', 'Employee Last Name');
    cy.get('#app div[data-rgcol="2"][canresize=""] div.header-content').should('have.text', 'Employee First Name');
    cy.get('#app div[data-rgcol="3"][canresize=""] div.header-content').should('have.text', 'Employee Middle Name');
  });

  it("17 - Report name should be unique", () => {
    login("Admin", "admin123");
    const reportName = 'report' + Math.random();
    cy.get('#app a[href="/web/index.php/pim/viewPimModule"]').click();
    cy.get('#app nav.oxd-topbar-body-nav li:nth-child(4)').click();
    cy.get('#app div.orangehrm-header-container button.oxd-button').click();
    cy.get('#app input[placeholder="Type here ..."]').click();
    cy.get('#app input.oxd-input--focus').type(reportName);
    cy.get('#app div:nth-child(5) div:nth-child(1) div.oxd-input-group div:nth-child(2) div.oxd-select-wrapper div.oxd-select-text div.oxd-select-text-input').click().type('{downarrow}{enter}', { force: true });
    cy.get('#app div.oxd-select-text--focus div.oxd-select-text-input').click().type('{downarrow}{enter}', { force: true });
    cy.get('#app div:nth-child(5) i.bi-plus').click();
    cy.get('#app button.orangehrm-left-space').click();

    cy.get('#app a[href="/web/index.php/pim/viewPimModule"]').click();
    cy.get('#app nav.oxd-topbar-body-nav li:nth-child(4)').click();
    cy.get('#app div.orangehrm-header-container button.oxd-button').click();
    cy.get('#app input[placeholder="Type here ..."]').click();
    cy.get('#app input.oxd-input--focus').type(reportName);
    cy.get('#app div:nth-child(5) div:nth-child(1) div.oxd-input-group div:nth-child(2) div.oxd-select-wrapper div.oxd-select-text div.oxd-select-text-input').click().type('{downarrow}{enter}', { force: true });
    cy.get('#app div.oxd-select-text--focus div.oxd-select-text-input').click().type('{downarrow}{enter}', { force: true });
    cy.get('#app div:nth-child(5) i.bi-plus').click();
    cy.get('#app button.orangehrm-left-space').click();

    cy.get('#app span.oxd-input-field-error-message').should('have.text', 'Already exists');
    cy.get('#app input.oxd-input--error').should('have.class', 'oxd-input--error');
    cy.get('#app input.oxd-input--error').should('be.visible');
  });

  it("18 - Required fields for assigned leave", () => {
    login("Admin", "admin123");
    cy.get('#app a[href="/web/index.php/leave/viewLeaveModule"]').click();
    cy.get('#app li:nth-child(6) span.oxd-topbar-body-nav-tab-item').click();
    cy.get('#app div:nth-child(1) > li > a.oxd-topbar-body-nav-tab-link').click();
    cy.get('#app nav.oxd-topbar-body-nav li:nth-child(6)').click();
    cy.get('#app div:nth-child(2) > li > a.oxd-topbar-body-nav-tab-link').click();
    cy.get('#app button.oxd-button').click();
    cy.get('#app input[placeholder="Type for hints..."]').should('be.visible');
    cy.get('#app input[placeholder="Type for hints..."]').click();
    cy.get('#app div:nth-child(1) > div.orangehrm-full-width-grid > div.oxd-grid-item > div.oxd-input-group > span.oxd-text').should('have.text', 'Required');
    cy.get('#app div:nth-child(1) > div.orangehrm-full-width-grid > div.oxd-grid-item > div.oxd-input-group > span.oxd-text').should('have.class', 'oxd-input-field-error-message');
    cy.get('#app div.oxd-select-text-input').should('have.text', '-- Select --');
    cy.get('#app div:nth-child(2) > div.orangehrm-full-width-grid > div:nth-child(1) > div.oxd-input-group > span.oxd-text').should('have.text', 'Required');
    cy.get('#app div:nth-child(2) > div.orangehrm-full-width-grid > div:nth-child(1) > div.oxd-input-group > span.oxd-text').should('have.class', 'oxd-input-field-error-message');
    cy.get('#app div.oxd-grid-4 div:nth-child(1) div.oxd-input-group span.oxd-text').should('have.text', 'Required');
    cy.get('#app div.oxd-grid-4 div:nth-child(1) div.oxd-input-group span.oxd-text').should('have.class', 'oxd-input-field-error-message');
    cy.get('#app div:nth-child(2) > div.oxd-input-group > span.oxd-text').should('have.text', 'Required');
    cy.get('#app div:nth-child(2) > div.oxd-input-group > span.oxd-text').should('have.class', 'oxd-input-field-error-message');
    cy.get('#app div:nth-child(2) > div.oxd-input-group > span.oxd-text').should('be.visible');
  });

  it("19 - Dashboard items are visible", () => {
    login("Admin", "admin123");
    cy.get('#app a[href="/web/index.php/dashboard/index"]').click();
    cy.get('#app div:nth-child(1) > div.oxd-sheet > div.orangehrm-dashboard-widget-header > div.orangehrm-dashboard-widget-name > p.oxd-text').should('have.text', 'Time at Work');
    cy.get('#app p.orangehrm-attendance-card-state').should('have.text', 'Punched Out');
    cy.get('#app div.orangehrm-attendance-card-summary-week p:nth-child(1)').should('have.text', 'This Week');
    cy.get('#app div:nth-child(2) > div.oxd-sheet > div.orangehrm-dashboard-widget-header > div.orangehrm-dashboard-widget-name > p.oxd-text').should('have.text', 'My Actions');
    cy.get('#app div:nth-child(3) > div.oxd-sheet > div.orangehrm-dashboard-widget-header > div.orangehrm-dashboard-widget-name > p.oxd-text').should('have.text', 'Quick Launch');
    cy.get('#app div:nth-child(4) div.orangehrm-dashboard-widget-name p.oxd-text').should('have.text', 'Buzz Latest Posts');
    cy.get('#app div.emp-leave-chart div.orangehrm-dashboard-widget-name p.oxd-text').should('have.text', 'Employees on Leave Today');
    cy.get('#app div:nth-child(6) div.orangehrm-dashboard-widget-name p.oxd-text').should('have.text', 'Employee Distribution by Sub Unit');
    cy.get('#app div:nth-child(7) p.oxd-text').should('have.text', 'Employee Distribution by Location');
  });

});
