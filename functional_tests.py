from selenium.webdriver import Firefox
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestLogin:
    def setup_method(self):
        self.browser = Firefox()

    def teardown_method(self):
        self.browser.quit()

    def test_login_success(self):
        self.browser.get("http://localhost:5500")
        assert "login" in self.browser.find_element_by_id(
            "loginBtn").text.lower()

    def test_login_inputs(self):
        self.browser.get("http://localhost:5500")
        self.browser.find_element_by_id("loginBtn").click()

        username = self.browser.find_element_by_id("username")
        username.send_keys("Dannyp_123")

        password = self.browser.find_element_by_id("password")
        password.send_keys("Dannyp123")

        self.browser.find_element_by_class_name("submitBtn").click()

        h1 = WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#gameArea")))

        assert "dannyp_123" in h1.text.lower()

    #make an error message to test

    #make a singin user taken message test

    def test_players_input(self):
        self.browser.get("http://localhost:5500")

        self.browser.find_element_by_id("loginBtn").click()

        username = self.browser.find_element_by_id("username")
        username.send_keys("Dannyp_123")

        password = self.browser.find_element_by_id("password")
        password.send_keys("Dannyp123")

        self.browser.find_element_by_class_name("submitBtn").click()

        player1 = WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located((By.ID, "player_1")))
        player2 = self.browser.find_element_by_css_selector("#player_2")

        player1.send_keys("on")
        player2.send_keys("no")

        submit = self.browser.find_element_by_id("newGameBtn")
        submit.click()

        player1_name = WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#player1 h3")))

        assert "on" in player1_name.text
