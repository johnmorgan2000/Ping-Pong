from selenium.webdriver import Firefox


def login(browser):
    button = browser.find_element_by_css_selector("#loginBtn")
    button.click()
    form = browser.find_element_by_css_selector("#loginField")
    username = form.find_element_by_css_selector("#username")
    username.send_keys("some")
    password = form.find_element_by_css_selector("#password")
    password.send_keys("pass")
    button = form.find_element_by_css_selector("button")
    button.click()


def main():
    browser = Firefox()
    browser.get("http://192.168.1.31:5500/index.html")
    login(browser)


if __name__ == '__main__':
    main()
