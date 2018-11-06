from selenium.webdriver import Firefox
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def login(browser):
    # click login button
    button = browser.find_element_by_css_selector("#loginBtn")
    button.click()

    #input login information
    form = browser.find_element_by_css_selector("#loginField")
    username = form.find_element_by_css_selector("#username")
    username.send_keys("some")
    password = form.find_element_by_css_selector("#password")
    password.send_keys("pass")

    #submit form
    button = form.find_element_by_css_selector("button")
    button.click()

    new_game(browser)


def new_game(browser):
    input1 = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "player_1")))
    input1.send_keys("some")

    input2 = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "player_2")))
    input2.send_keys("please")

    button = browser.find_element_by_css_selector("#newGameBtn")
    button.click()

    score_game(browser)


def score_game(browser):
    button1 = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".up.player_1Btn")))
    button2 = browser.find_element_by_css_selector(".down.player_1Btn")
    button3 = browser.find_element_by_css_selector(".up.player_2Btn")
    button4 = browser.find_element_by_css_selector(".down.player_2Btn")

    for _ in range(2):
        button1.click()

    for _ in range(1):
        button2.click()

    for _ in range(6):
        button3.click()

    for _ in range(7):
        button4.click()

    score_btn = browser.find_element_by_css_selector("#scoreGameBtn")
    score_btn.click()

    browser.refresh()


def main():
    browser = Firefox()
    browser.get("http://192.168.1.31:5500/index.html")

    login(browser)


if __name__ == '__main__':
    main()
