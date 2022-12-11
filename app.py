from flask import Flask, render_template, request, jsonify
import nltk
nltk.download('stopwords')
import pickle
from nltk.corpus import stopwords
import re
from nltk.stem.porter import PorterStemmer
import numpy as np
import bs4
import urllib.request

app = Flask(__name__)
ps = PorterStemmer()

model = pickle.load(open('Model/logreg_fakenews.pickle', 'rb'))
tfidfvect = pickle.load(open('Model/tfidf.pickle', 'rb'))


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


def get_all_content(urll):
    try:
        webpage = str(urllib.request.urlopen(urll).read().decode('utf-8'))
        soup = bs4.BeautifulSoup(webpage, "html.parser")
        title = soup.find('title').string
        content = '-'.join(filter(lambda x: x != '\n',
                           soup.find('article').strings))
        return title + '\n' + content
    except:
        return urll


def predict(text, title, author):
    # /////////////////
    # print(text[0: 4])
    is_url = 'http://' in text[0:10] or 'https://' in text[0:10]
    if is_url:
        text = get_all_content(text)
    # ////////////////

    content = title + ' ' + author + ' ' + text
    tokens = re.sub('[^a-zA-Z]', ' ', content)
    review = tokens.lower()
    review = review.split()
    review = [ps.stem(word)
              for word in review if not word in stopwords.words('english')]
    review = ' '.join(review)

    review_vect = tfidfvect.transform([review]).toarray()
    result = model.predict(review_vect)[0]
    prob = model.predict_proba(review_vect)[0]
    prediction = f"giả ({prob[1]:.2})" if result else f"thật ({prob[0]:.2})"
    print(model.predict(review_vect))

    diction = measure_importance(review_vect)
    # print(diction)
    return prediction, diction, tokens, text if is_url else None


@app.route('/', methods=['POST'])
def webapp():
    text = request.form['textInput']
    author = request.form['authorInput']
    title = request.form['titleInput']

    prediction, weighted_stems, tokens, news_from_url = predict(
        text, title, author)

    coloring = dict()
    for word in tokens.split():
        stemmed = ps.stem(word.lower()) if not word in stopwords.words(
            'english') else word.lower()
        if stemmed in weighted_stems:
            coloring[word] = weighted_stems[stemmed] if stemmed in weighted_stems else 0

    return render_template('index.html',
                           original=news_from_url if news_from_url else text,
                           textInput=text,
                           result=prediction,
                           dict=coloring)


@app.route('/predict/', methods=['GET', 'POST'])
def api():
    text = request.args.get("text")
    prediction = predict(text)
    return jsonify(prediction=prediction)


def measure_importance(review_vect):
    word_indexes = np.argwhere(review_vect[0])
    word_values = review_vect[0, word_indexes][:, 0]
    words = tfidfvect.get_feature_names_out()[word_indexes][:, 0]
    # print(word_values)
    # print(word_indexes[:, 0])
    word_coeffs = model.coef_[0][word_indexes[:, 0]]
    word_importance = word_coeffs * word_values
    return dict(zip(words, word_importance))


if __name__ == "__main__":
    app.run(debug=True)
