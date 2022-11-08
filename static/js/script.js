var opened_example_list = false;
var mode = 'text';

function toggle_mode() {
    let element = document.getElementById('textInput');
    if (mode == 'text') {
        element.setAttribute('rows', 5);
        element.setAttribute('placeholder', 'Nhập đường dẫn ...');
        mode = 'url';
    }
    else {
        element.setAttribute('rows', 20);
        element.setAttribute('placeholder', 'Nội dung bài báo ...');
        mode = 'text';
    }
}

function clear_area_content() {
    document.getElementById('textInput').value = '';
    document.getElementById('textInput').style.color = 'black';
    document.getElementById('titleInput').value = '';
    document.getElementById('authorInput').value = '';
}

function show_example_list() {
    if (opened_example_list) {
        document.getElementById('examples').style.visibility = 'hidden';
        opened_example_list = false;
    }
    else {
        document.getElementById('examples').style.visibility = 'visible';
        opened_example_list = true;
    }
}

example_input = [
    [`House Dem Aide: We Didn’t Even See Comey’s Letter Until Jason Chaffetz Tweeted It By Darrell Lucus on October 30, 2016 Subscribe Jason Chaffetz on the stump in American Fork, Utah ( image courtesy Michael Jolley, available under a Creative Commons-BY license) 
    With apologies to Keith Olbermann, there is no doubt who the Worst Person in The World is this week–FBI Director James Comey. But according to a House Democratic aide, it looks like we also know who the second-worst person is as well. It turns out that when Comey sent his now-infamous letter announcing that the FBI was looking into emails that may be related to Hillary Clinton’s email server, the ranking Democrats on the relevant committees didn’t hear about it from Comey. They found out via a tweet from one of the Republican committee chairmen. 
    As we now know, Comey notified the Republican chairmen and Democratic ranking members of the House Intelligence, Judiciary, and Oversight committees that his agency was reviewing emails it had recently discovered in order to see if they contained classified information. Not long after this letter went out, Oversight Committee Chairman Jason Chaffetz set the political world ablaze with this tweet. FBI Dir just informed me, "The FBI has learned of the existence of emails that appear to be pertinent to the investigation." Case reopened 
    — Jason Chaffetz (@jasoninthehouse) October 28, 2016 
    Of course, we now know that this was not the case . Comey was actually saying that it was reviewing the emails in light of “an unrelated case”–which we now know to be Anthony Weiner’s sexting with a teenager. But apparently such little things as facts didn’t matter to Chaffetz. The Utah Republican had already vowed to initiate a raft of investigations if Hillary wins–at least two years’ worth, and possibly an entire term’s worth of them. Apparently Chaffetz thought the FBI was already doing his work for him–resulting in a tweet that briefly roiled the nation before cooler heads realized it was a dud. 
    But according to a senior House Democratic aide, misreading that letter may have been the least of Chaffetz’ sins. That aide told Shareblue that his boss and other Democrats didn’t even know about Comey’s letter at the time–and only found out when they checked Twitter. “Democratic Ranking Members on the relevant committees didn’t receive Comey’s letter until after the Republican Chairmen. In fact, the Democratic Ranking Members didn’ receive it until after the Chairman of the Oversight and Government Reform Committee, Jason Chaffetz, tweeted it out and made it public.” 
    So let’s see if we’ve got this right. The FBI director tells Chaffetz and other GOP committee chairmen about a major development in a potentially politically explosive investigation, and neither Chaffetz nor his other colleagues had the courtesy to let their Democratic counterparts know about it. Instead, according to this aide, he made them find out about it on Twitter. 
    There has already been talk on Daily Kos that Comey himself provided advance notice of this letter to Chaffetz and other Republicans, giving them time to turn on the spin machine. That may make for good theater, but there is nothing so far that even suggests this is the case. After all, there is nothing so far that suggests that Comey was anything other than grossly incompetent and tone-deaf. 
    What it does suggest, however, is that Chaffetz is acting in a way that makes Dan Burton and Darrell Issa look like models of responsibility and bipartisanship. He didn’t even have the decency to notify ranking member Elijah Cummings about something this explosive. If that doesn’t trample on basic standards of fairness, I don’t know what does. 
    Granted, it’s not likely that Chaffetz will have to answer for this. He sits in a ridiculously Republican district anchored in Provo and Orem; it has a Cook Partisan Voting Index of R+25, and gave Mitt Romney a punishing 78 percent of the vote in 2012. Moreover, the Republican House leadership has given its full support to Chaffetz’ planned fishing expedition. But that doesn’t mean we can’t turn the hot lights on him. After all, he is a textbook example of what the House has become under Republican control. And he is also the Second Worst Person in the World. About Darrell Lucus 
    Darrell is a 30-something graduate of the University of North Carolina who considers himself a journalist of the old school. An attempt to turn him into a member of the religious right in college only succeeded in turning him into the religious right's worst nightmare--a charismatic Christian who is an unapologetic liberal. His desire to stand up for those who have been scared into silence only increased when he survived an abusive three-year marriage. You may know him on Daily Kos as Christian Dem in NC . Follow him on Twitter @DarrellLucus or connect with him on Facebook . Click here to buy Darrell a Mello Yello. Connect`,
    `House Dem Aide: We Didn’t Even See Comey’s Letter Until Jason Chaffetz Tweeted It`,
    `Darrell Lucus`],
    [`In these trying times, Jackie Mason is the Voice of Reason. [In this week’s exclusive clip for Breitbart News, Jackie discusses the looming threat of North Korea, and explains how President Donald Trump could win the support of the Hollywood left if the U. S. needs to strike first.  “If he decides to bomb them, the whole country will be behind him, because everybody will realize he had no choice and that was the only thing to do,” Jackie says. “Except the Hollywood left. They’ll get nauseous. ” “[Trump] could win the left over, they’ll fall in love with him in a minute. If he bombed them for a better reason,” Jackie explains. “Like if they have no transgender toilets. ” Jackie also says it’s no surprise that Hollywood celebrities didn’t support Trump’s strike on a Syrian airfield this month. “They were infuriated,” he says. “Because it might only save lives. That doesn’t mean anything to them. If it only saved the environment, or climate change! They’d be the happiest people in the world. ” Still, Jackie says he’s got nothing against Hollywood celebs. They’ve got a tough life in this country. Watch Jackie’s latest clip above.   Follow Daniel Nussbaum on Twitter: @dznussbaum`,
    `Jackie Mason: Hollywood Would Love Trump if He Bombed North Korea over Lack of Trans Bathrooms (Exclusive Video) - Breitbart`,
    `Daniel Nussbaum`]
]

function get_example(ith) {
    if (mode == 'text'){
        let index = ith - 1;
        document.getElementById('textInput').value = example_input[index][0];
        document.getElementById('titleInput').value = example_input[index][1];
        document.getElementById('authorInput').value = example_input[index][2];
        show_example_list();
    }
    
}

function predict_function() {
    let content = document.getElementById('textInput');
    //////////////// model predict ////////////////////
    res = '';
    if (content.value[0] == 'H') {
        if (example_input[0][1] == 1) {
            res = 'Tin thật';
            content.style.color = 'green';
        }
    }
    else if (content.value[0] == 'E') {
        if (example_input[1][1] == 0) {
            res = 'Tin giả';
            content.style.color = 'red';
        }
    }
    else {
        res = 'Nhập nội dung bài viết';
    }
    ////////////// visulize ///////////////////
    let element = document.getElementById('result');
    element.style.visibility = 'visible';
    element.innerHTML = '<strong>' + res + '</strong>';
}