var availablePositions = {
    'movePositon': {
        '.box1 .p1': ['.box2 .p1', '.box6 .p1', '.box5 .p1'],
        '.box2 .p1': ['.box1 .p1', '.box3 .p1', '.box6 .p1'],
        '.box3 .p1': ['.box2 .p1', '.box4 .p1', '.box6 .p1', '.box7 .p1', '.box8 .p1'],
        '.box4 .p1': ['.box3 .p1', '.box4 .p2', '.box8 .p1'],
        '.box4 .p2': ['.box4 .p1', '.box8 .p2', '.box8 .p1'],

        '.box5 .p1': ['.box1 .p1', '.box6 .p1', '.box9 .p1'],
        '.box6 .p1': ['.box5 .p1', '.box1 .p1', '.box2 .p1', '.box3 .p1', '.box7 .p1', '.box11 .p1', '.box10 .p1', '.box9 .p1'],
        '.box7 .p1': ['.box3 .p1', '.box8 .p1', '.box6 .p1', '.box11 .p1'],
        '.box8 .p1': ['.box3 .p1', '.box4 .p1', '.box4 .p2', '.box8 .p2', '.box12 .p2', '.box12 .p1', '.box11 .p1', '.box7 .p1'],
        '.box8 .p2': ['.box4 .p2', '.box12 .p2', '.box8 .p1'],

        '.box9 .p1': ['.box5 .p1', '.box6 .p1', '.box10 .p1', '.box13 .p1', '.box14 .p1'],
        '.box10 .p1': ['.box9 .p1', '.box6 .p1', '.box11 .p1', '.box14 .p1'],
        '.box11 .p1': ['.box6 .p1', '.box7 .p1', '.box8 .p1', '.box10 .p1', '.box12 .p1', '.box14 .p1', '.box15 .p1', '.box16W .p1'],
        '.box12 .p1': ['.box8 .p1', '.box12 .p2', '.box16 .p1', '.box11 .p1'],
        '.box12 .p2': ['.box12 .p1', '.box8 .p1', '.box8 .p2', '.box16 .p1', '.box16 .p2'],

        '.box13 .p1': ['.box9 .p1', '.box14 .p1', '.box13 .p4'],
        '.box14 .p1': ['.box13 .p1', '.box9 .p1', '.box10 .p1', '.box11 .p1', '.box3 .p1', '.box15 .p1', '.box15 .p4', '.box14 .p4', '.box13 .p4'],
        '.box15 .p1': ['.box14 .p1', '.box11 .p1', '.box16 .p1', '.box15 .p4'],
        '.box16 .p1': ['.box15 .p1', '.box11 .p1', '.box12 .p1', '.box12 .p2', '.box8 .p2', '.box16 .p2', '.box16 .p3', '.box16 .p4', '.box15 .p4'],
        '.box16 .p2': ['.box16 .p1', '.box12 .p2', '.box16 .p3'],

        '.box13 .p4': ['.box13 .p1', '.box14 .p1', '.box14 .p4'],
        '.box14 .p4': ['.box13 .p4', '.box14 .p1', '.box15 .p4'],
        '.box15 .p4': ['.box14 .p4', '.box15 .p1', '.box16 .p1', '.box16 .p4', '.box15 .p4'],
        '.box16 .p4': ['.box15 .p1', '.box16 .p4', '.box16 .p3'],
        '.box16 .p3': ['.box16 .p1', '.box16 .p2', '.box16 .p4'],
    },
    'feedPosition': {
        '.box1 .p1': [
            {
                'destination': '.box3 .p1',
                'food': '.box2 .p1'
            },
            {
                'destination': '.box11 .p1',
                'food': '.box6 .p1'
            },
            {
                'destination': '.box9 .p1',
                'food': '.box5 .p1'
            },
        ],
        '.box2 .p1': [
            {
                'destination': '.box10 .p1',
                'food': '.box6 .p1'
            },
            {
                'destination': '.box4 .p1',
                'food': '.box3 .p1'
            }
        ],
        '.box3 .p1': [
            {
                'destination': '.box1 .p1',
                'food': '.box2 .p1'
            },
            {
                'destination': '.box4 .p2',
                'food': '.box4 .p1'
            },
            {
                'destination': '.box12 .p2',
                'food': '.box8 .p1'
            },
            {
                'destination': '.box11 .p1',
                'food': '.box7 .p1'
            },
            {
                'destination': '.box9 .p1',
                'food': '.box6 .p1'
            },
        ],
        '.box4 .p1': [
            {
                'destination': '.box12 .p1',
                'food': '.box8 .p1'
            },
            {
                'destination': '.box2 .p1',
                'food': '.box3 .p1'
            }
        ],
        '.box4 .p2': [
            {
                'destination': '.box3 .p1',
                'food': '.box4 .p1'
            },
            {
                'destination': '.box11 .p1',
                'food': '.box8 .p1'
            },
            {
                'destination': '.box12 .p2',
                'food': '.box8 .p2'
            },
        ],

        '.box5 .p1': [
            {
                'destination': '.box7 .p1',
                'food': '.box6 .p1'
            },
            {
                'destination': '.box13 .p1',
                'food': '.box9 .p1'
            }
        ],
        '.box6 .p1': [
            {
                'destination': '.box8 .p1',
                'food': '.box7 .p1'
            },
            {
                'destination': '.box16 .p1',
                'food': '.box11 .p1'
            },
            {
                'destination': '.box14 .p1',
                'food': '.box10 .p1'
            },
        ],
        '.box7 .p1': [
            {
                'destination': '.box5 .p1',
                'food': '.box6 .p1'
            },
            {
                'destination': '.box15 .p1',
                'food': '.box11 .p1'
            },
            {
                'destination': '.box8 .p2',
                'food': '.box8 .p1'
            },
        ],
        '.box8 .p1': [
            {
                'destination': '.box6 .p1',
                'food': '.box7 .p1'
            },
            {
                'destination': '.box16 .p1',
                'food': '.box12 .p1'
            },
            {
                'destination': '.box14 .p1',
                'food': '.box11 .p1'
            },
        ],
        '.box8 .p2': [
            {
                'destination': '.box7 .p1',
                'food': '.box8 .p1'
            },
            {
                'destination': '.box16 .p2',
                'food': '.box12 .p2'
            }
        ],

        '.box9 .p1': [
            {
                'destination': '.box1 .p1',
                'food': '.box5 .p1'
            },
            {
                'destination': '.box3 .p1',
                'food': '.box6 .p1'
            },
            {
                'destination': '.box11 .p2',
                'food': '.box10 .p1'
            },
            {
                'destination': '.box15 .p4',
                'food': '.box14 .p1'
            },
            {
                'destination': '.box13 .p4',
                'food': '.box13 .p1'
            },
        ],
        '.box10 .p1': [
            {
                'destination': '.box2 .p1',
                'food': '.box6 .p1'
            },
            {
                'destination': '.box12 .p1',
                'food': '.box11 .p1'
            },
            {
                'destination': '.box14 .p4',
                'food': '.box14 .p1'
            },
        ],
        '.box11 .p1': [
            {
                'destination': '.box9 .p1',
                'food': '.box10 .p1'
            },
            {
                'destination': '.box1 .p1',
                'food': '.box6 .p1'
            },
            {
                'destination': '.box3 .p1',
                'food': '.box7 .p1'
            },
            {
                'destination': '.box4 .p2',
                'food': '.box8 .p1'
            },
            {
                'destination': '.box12 .p2',
                'food': '.box12 .p1'
            },
            {
                'destination': '.box16 .p3',
                'food': '.box16 .p1'
            },
            {
                'destination': '.box15 .p4',
                'food': '.box15 .p1'
            },
            {
                'destination': '.box13 .p4',
                'food': '.box14 .p1'
            },
        ],
        '.box12 .p1': [
            {
                'destination': '.box4 .p1',
                'food': '.box8 .p1'
            },
            {
                'destination': '.box10 .p1',
                'food': '.box11 .p1'
            },
            {
                'destination': '.box16 .p4',
                'food': '.box16 .p1'
            },
        ],
        '.box12 .p2': [
            {
                'destination': '.box11 .p1',
                'food': '.box12 .p1'
            },
            {
                'destination': '.box3 .p1',
                'food': '.box8 .p1'
            },
            {
                'destination': '.box4 .p2',
                'food': '.box8 .p2'
            },
            {
                'destination': '.box16 .p3',
                'food': '.box16 .p2'
            },
            {
                'destination': '.box15 .p4',
                'food': '.box16 .p1'
            },
        ],

        '.box13 .p1': [
            {
                'destination': '.box5 .p1',
                'food': '.box9 .p1'
            },
            {
                'destination': '.box15 .p1',
                'food': '.box14 .p1'
            }
        ],
        '.box14 .p1': [
            {
                'destination': '.box6 .p1',
                'food': '.box10 .p1'
            },
            {
                'destination': '.box8 .p1',
                'food': '.box11 .p1'
            },
            {
                'destination': '.box16 .p1',
                'food': '.box15 .p1'
            },
        ],
        '.box15 .p1': [
            {
                'destination': '.box13 .p1',
                'food': '.box14 .p1'
            },
            {
                'destination': '.box7 .p1',
                'food': '.box11 .p1'
            },
            {
                'destination': '.box16 .p2',
                'food': '.box16 .p1'
            },
        ],
        '.box16 .p1': [
            {
                'destination': '.box14 .p1',
                'food': '.box15 .p1'
            },
            {
                'destination': '.box6 .p1',
                'food': '.box11 .p1'
            },
            {
                'destination': '.box8 .p1',
                'food': '.box12 .p1'
            },
        ],
        '.box16 .p2': [
            {
                'destination': '.box15 .p1',
                'food': '.box16 .p1'
            },
            {
                'destination': '.box8 .p2',
                'food': '.box12 .p2'
            }
        ],

        '.box13 .p4': [
            {
                'destination': '.box9 .p1',
                'food': '.box13 .p1'
            },
            {
                'destination': '.box11 .p1',
                'food': '.box14 .p1'
            },
            {
                'destination': '.box15 .p4',
                'food': '.box14 .p4'
            }
        ],
        '.box14 .p4': [
            {
                'destination': '.box10 .p1',
                'food': '.box14 .p1'
            },
            {
                'destination': '.box16 .p4',
                'food': '.box15 .p4'
            }
        ],
        '.box15 .p4': [
            {
                'destination': '.box13 .p4',
                'food': '.box14 .p4'
            },
            {
                'destination': '.box9 .p1',
                'food': '.box14 .p1'
            },
            {
                'destination': '.box11 .p1',
                'food': '.box15 .p1'
            },
            {
                'destination': '.box12 .p2',
                'food': '.box16 .p1'
            },
            {
                'destination': '.box16 .p3',
                'food': '.box16 .p4'
            },
        ],
        '.box16 .p4': [
            {
                'destination': '.box14 .p4',
                'food': '.box15 .p4'
            },
            {
                'destination': '.box12 .p1',
                'food': '.box16 .p1'
            }
        ],
        '.box16 .p3': [
            {
                'destination': '.box15 .p4',
                'food': '.box16 .p4'
            },
            {
                'destination': '.box11 .p1',
                'food': '.box16 .p1'
            },
            {
                'destination': '.box12 .p2',
                'food': '.box16 .p2'
            },
        ],
    }
};