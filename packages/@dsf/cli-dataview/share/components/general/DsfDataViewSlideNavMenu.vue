<template>
  <div
    class="ds-slide-nav-menu ds-control"
    :class="[
      {
        'ds-designer-mode': isDesign,
      },
    ]"
    :style="rootStyle"
  >
    <div class="ds-slide-nav-menu-inner data-view-common-bg-effect" :style="rootInnerStyle">
      <div class="ds-prev" @click="prev" slot-name="leftArrow" v-show="isSlideable" :style="arrowStyle">
        <slot name="leftArrow">
          <DsfIcon name="nav_arrow_left"></DsfIcon>
        </slot>
      </div>
      <div :style="containerStyle">
        <div class="ds-slide-container">
          <div
            class="ds-slide-item"
            v-for="(item, idx) in computedClonedItems"
            :key="item.virtualId"
            :style="getItemStyle(idx, item)"
            @mouseenter="(e) => handleMouseEnter(item, e)"
            @mouseleave="(e) => handleMouseLeave(item, e)"
            @click="clickItem($event, item, idx)"
          >
            <div class="ds-slide-item-inner data-view-common-bg-effect">
              <template v-if="item.valueShowType === 'img'">
                <el-image
                  v-if="item.valueShowPosition === 'before' && item.valueImgObj && item.valueImgObj.defaultValue"
                  :src="handleImgSrcStr(item.valueImgObj.defaultValue)"
                  :style="getImgStyle(item.valueImgObj)"
                  class="show-img before"
                >
                  <img
                    slot="error"
                    style="width: 100%; height: 100%"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAA4CAYAAABABo41AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAARqADAAQAAAABAAAAOAAAAAAox162AAAYM0lEQVRoBe2bWYxlx1nH66x362W6Z/PY47EzIYo1jsgyERGL8AR4AsJDYCwihBJBBAiUBySEyEvSQQKxvBE5QiIhQiIgbAkEhAdEgiYCRWzOQuJxyGIbZ5IZz0z3dPftu52t+P3r3Oo5ffveWZw8Uq1z6pw6p6q+71//76uv6tw25v/TXASCmVLd25my78rtF/Ly94IweFdVVWfUYBAExlrrct2r02bn/toLyPt7vPXX3xuGv8h1oTrf5eS7dM36fpt9NMu+KyD9+9C+rzLVH+1r3+xt0fUsUtP3wsD8/tu60W8tqnYf5U09Ve2ArrMP9cK8skMVVXAv6b+sTfZ27f9WlT0FSWDJvdQSo+p3lSupXl0WDAMTPPT2tWC7fnLf53vSL76PZn2D96ha3fKNm+ZnLKDcQdO5IqgTdXi4M9vFlH6eRx+eW3FxoZd/8RuNJ/cDjK82X17/dCYfTez7apZ4FX3um/HyLoZCTcISQMInuT/zKxTdDzC+kxnpFt8errCxEbrXNza8Botr108WvveXL9u3Vrn9T73mHa1ypVlTuc2PWqTD7x901mEQ/PC7zgb/4hpbfDqs3+y7Gxv1OxsbVfPR4YrWBuZDH7pd/h0A9LH/sR/HjN7jO0SZH/2Fx4J/9vf3k//pV+yPVNZ+et9JheGfv/cxZ1KzzdyWffZJ894DorIPflDT44EBvrspNRtQI4uB8gLtdzAc2yf2FcEEYv+G2rnPNJzQAGlKOBHsB2eauHPrs3rMVJ69nQ/MuXN1J5cv7yu5X9F3cGeAXL1xFpw86D3tp//wPw4wdr/Z2QvvT5Qr4au4qn2MKwjMSZfXp8WgeHkbL+9fej3n+Pjan+y/yUWTUqp4u3LzLTFnsTC1wwjGE/u1UYZS7rCNnGsUHWXT3F3Xyvv3J1ng3ldeX9v9XPXGmfmqpJ0eB2Xzd4tknNWrqfO07nzGHD9eK33jRj1cTXCaLPIdL2DPOA8+ihOdzh4eR5976etcJlJHw/X9fOesZ3V9zn9Svznn7OVqPmrq4Mulp9fRl03zw4zxL3z1q4FRRQ+SL59FW+XzBKE4uWA+MsqCvx1Npqzxec2iV3j2uzybiD3jvGaMcgCdYIa/M8mDa66u6jWO8ST4m+Tt5o+9SAfyWVnmyev1Wl4+rN+0sUXDF5nLlyMzGtWM6ffrfBbdJnu8dDPs2WCWu/5Jo1jmvbiI1zLgL3H9r2FsPvCRnwiu/drf27dU1vwm5d9vKkgTms8i1B889Y7gc7/6D/aBqjQb3P8QxyPU+zrPP/bUT5qnxK79NAuGfzDLEj/IAkSp05GrKOm19FV83mjdF5E//XRk3vzm2GQYs5IHSNcC6T4Aetra8KIxVVORX/onu5JtozATVTc0G0+9M9hU00q//lnbuXXVvB8Q3olw7//4T5tP+rq/8Y+2OylN9OEfD/r125zngTIPEA+GKgoQpTQNzOc/X5gnn7xHYBTkPfHu1JwurPkewLnsmqlPHqRZgBaw52f/wn4JdI8ElfmUDc0u+eu5/z4T2COacFB6QPYlJH0B1pwBkDcySSzf7lFrI/M8z0Lee5w61/7q54JH3fO7gSKGeEA8GKp4juPrgHKFAOIzf5YB7qGpskbO9dI4Kci79FLLlQgcn+6FQTMA/dSZD7jR0Kj7aFbN+WvlSnd77l6anv7u5d+OmvfuusmSJiB66EERQ3wSKEoXHiVCOhjcqXj+rKQXX3zRmM1WaG7E1pwCnJd4+7SqNJLY40fEF59jOBrg4EjrJwLATzWuROUCxcvqr5WrmHJfR/czj1W0nwSK9x8q9DLNAiIwHuX5VfLlKDBHJ/Jq0w5V8XaaD4yev8RxItasVZlNGmmV+BYanADSLEC85JLMSwI+8cT+NDi65vs9CEStN0vCfVy4cK/UBT6Y8wGe72I/9wyZB8h53rqMH/EMESAtHZRLlx67OjFHceqQb/HtLwbmxKOVSbfq6bxg3mimK9MbASTz0sh49vgZbCrw+GWvueo0rw9SwJNjalkAdtD0pj3W2SKG6KlkkU8UKN5cBEoKIErJFJQ0Ck3meOiKZ0+LgTkHU74QhmaJKhF0i/F9HiB1ksEgBxCdej/kwVEvU4CIS0qUPewT9kFqgtUQz+HGs/0h8UAi1zyWqKpAuRsgEYhHgLOHbuWz+603enaXi4GRCakR1wDArEq9uwGUWsegBkAs/j6Pr3jr1E7otAZCJuRZIkkOOWPe8+bkJHUVXPXPuXvvR3RzP4DsCJjp8abzr8KUAibW/2b3sB1FJq8qs4caKwATzQHIScpJDJJ5adSmM9goyX85GCYfBeY31fbhX57Ja8W1/K8fHGIMsZAxX7Bx/l7nXAWGUtOPPMq9HKsY7U3GM4Q9D4IFnnEksEU6NfjI9YE0leJA2e2bF28dMWWcYgzsZTOAakyGscLB5ogp8T26l4nlHDIv55ynU3xzeve+R637ANGbhL/XbNb0H77cv6e6Yso8ULwfESBKp8h38CMeEM+SmNg50lFk5jVrC/eN7wzMv22umJV2z6QE5uJ1IYAECEcPkBaBI8E8QB4clcnEmgCpzKd5IPhnypuA6N77EgHi7hewZAA7BIoAEijaG83CyCTjgXnd0V1Xd87pTj7GmDPrhRmMIhrCpABFScwJMakB1449DfPSU42Y2KPkTcuD40faPZyeBJSUbvoMD16zrFm3CYo3GzXXgiFyrE2WyGwExxhQWoCjvAxik+cL/YuaujNjnrOpaZsHTDWSCVWmxbEHMAJJbBGD7sYeMUdJM5cHyBVwEoPulJpg6D0PiK6bpqOYpOlLZlkiMJbQdUIuMwo7oTlrruHPWOfPT3dmzHOmNG+lwQKEk05pilFoEsDIKGvBDqUme0rYs1RSPrObIXAUU8wGhlJ0Fiwvp541k49JVDYPlD2xBUbo8CwRCCNXFqJDZGIcdj6OkF0D8h0wRkJ8w56hmdQU45KmSlgjppTOpMQiscf7nu7U73jfMwEkb1ZyzKem7LkKSMfHNbDqw6evcfE6fzPNb7TDA/W86cyyROYzlNmQy5eIJTKhUdwzHfK2zUxOPBW3I+4y89rg5ZmeDtzemTF6NTcFHfRMqx2btbxnvp3cNHZM54CjNOZoc8j3DGGKNy2xpsWpGRgqHHdJywsU9mZWFxKPcOH80pRh3rFqzaaUcsybhr3pCBABI1DEFplPwXqwbMEUBrWaxNzFSDV07d3hdHdghG5HjdPF2E6AiA0sQIjRIhzh6Bz+801raR1W3KR79NIIK/no2d1MTz6S1q2utXDVukbXSh4Md8PJ+xMFn7peE1umYMiPJNPrHF+Sjiem66BITNyKxBkGk33CO6e7A7NuJsxAQtma3VTTdmqSdumaZvuJu1p4H/TrPQGhQHC0ExAH1dO75PDRc5+X13jen3bPtqVZ13YLaUsATstXub9FH25ZQrmiViXvSxSsiSE3pmCIIWJKjD/JyPWXYDrifJdGC2AZu8bV4x3T3YHZdq6WzkwifZmVtMFkzVG8+g7mUOArEpxagTENmGVSfI7ie5mWcv254J+6W8uKY4zpku8QQki8Hu8oXZ0q7e8H3O9QHq5gXn1N5wBCrmR51geEFVcH/0EuIArkkJQZBzt9zpQ180bFaZhuzG68yUCG5ozr2TW16HR3YD4BN97j1GyZVp6YPBnRZUnTLTph2m5XjEJtXkmnohxfw5HoGbnAUvkQsxbfDAoKkPFK0I2HgVWY3kzgNdK9nPzVLqFBsw6mdbyL32N27AHCCKVzFO2Sy6R3OMvRiikCoOLQ3XackO8xuJJYvvGupnRQqKaA9bWeswVt32C6xUOM0Lq5Hn3DNa4le/0nYARCxYcgziwkSwmVI1rQAaAOeQ+hOpTrGu9Rps7rmCg2QcUs4fxPLQtgsiiqOMqwKlEiynFUWqOPTVCOjY2GxFD1kdNzyGwT0bcg6NCs/tocMnGZkCYApZwRmfCRbjl/3pxNv0hJrZt7ePi0iDG1kNpT3dhQo0x1oD5E0GHRcyAIsDIuzYgZpBCB41Uiz2MoeoxuVk2QdFEv5S3URLZM0TB+ZEJeEQxpZte9n7Txoy7pXoBHFatYfBEW4lST4rXTBSte0th3kKyeYXYAbtNMyk1TRTvMdrljjFxtQb0OapaOe4kZAKRA8brVvdbmXF+7cw3A7YJ9QC6YJ8JLm6drl/ruh7HR1htpXJMeI8F0qyCvqo4CxqNUP4XyiOnGueCt2sdUsCFCdFTi0FhyZj9Zguna9y7wNOtVFRSnS+d29BB5K4JG56+ccxYbdceWJMgGlGloQ5BPqQj/OGvOfAVWvcSTLWY2tc7sxV3CeXfyZfOJb77Mnblw9Ep5yXymAiQPjM9ds3pHyQl88eLTwWXzeHTJrMXrr2vFxVYc736L9x7iTy6vIGgrolUTV4/Dkochc0GAB8VLOg9T4huEAzjtpSYsKWpgZCDqQ4oVHDkgCGJoI8GRJ3ALVYCZCUidsiz6iJx46TbDDBSLyw4tyJcQjYeFyWCDvFsanmASeAuD8E0zrC7j4Jmyg7bph30gC1eOnujF60VxaatXPG5OFOcuniufeeZJD4rL/ZiRbwQXNqYseWw1WbbtVpFlbdteapWt0XL+2MoPIFwPlQAoPIvCHcxjE7HwHHzuiKwcnOIU1AaFEBsIKJMhWHyIygd2B8ExgWAJ8ROu5V9gEkzTuCrpqgoBkgCytGLoeFrPmm64RGt6AzeOpcW2hj3GgQdM0eqr4uNZFgzwUDH+5RjtsLqzL2JI15FjkDw/+Gy0XewGtpjEaTru84XdfGUnd+zZgD1mQ8BYEbFOF88FznROH0mXynY7L4telQY96vcIXFbyIRN0ou86YY/1UIRgt2DKAAqvo9gyaxGZgASEOU5gABE4UoUvShVKqkuNfMyUL+I743JyoOx0dnLAOHrpCyF1Kj5v0G4RuMkd3WPYKbY543M+SMszGnAtirWRY982wGnyXjHD6PUYGCBV30gn5ngWBSn+fmDzcrAUdcK900Fw6QrO4eI5a55xUiKeRMURnS/eFl09ezxZDjvtol0uwfCVyqbr7Xb8YFLa9awbPGRbEWypFGRXBGun3GwzsIpgWkSbK4C0apIKJ8x1AovSYBkwdSwRa7C3Exxnal1FWAakQkGAs4DIRgZtKDSc5iiJB0E2BWvMa3bdrEQnqAUzGXuxNVDIptnO9gCwhywdZiwCOIAciDG0u4oPLFlBV7Rnwm64V95s7ZR51Iq7WL6tUMwSiHaKpMpWw+r8MKquvuNBay5dkoB1evYNq+HaMI3HadaqyqAXhslq2opOsZzpTUqbVIVFoapj9qrrrEVWWB6M4MoR07UtsGZewgEWsKLADygeFmuc62VlHnAtNXXIB+kCTORy3PhMY7y6nBItQi0mIbOoGIgy1IqtoAKDwDOZmha0VUkZvsXCMMErJh0JVs0mgyUjvBHhc+gvwQem5UNmaDvjoiDqSaJWK4qKnIolthGW+VqW5mBQ4K6dk6uBeY4PVqfbYflwFMHoBM1agL9SFMQiZdgpg7IX5WmnHIWvZQx7CLBFuJQTFwyYQrFluwRnemY5UFhVm0+JaeA6AEteRazCMzSAmOLjopbQTduCjeTexzZQTj6GTVNErXMXmOF7ImxHkseYlWOQmMd9vxqwZoKM+CKZZAFw7NVBzjMmD5fDLIvLMFyh+h465ik6jqpqYPGFRFaReZFI/or70VTDx0gkrT3yIEzkyMoyyqmN1SQMfJJbxQYJka3MSV6/HNI5+3iM0gRHeBWotK2l6LKFbWNcmFIC4WGL9kIk+TRpCnaJHDKhCZ1PcZGKCmHUbgnQFj9TOpAAl+sc9ugvY2ofw6Y8zIiNNC/p/Xp3MSwBLIYZ8RFkxcyQJa52KyYA4r4ER5hkmAWRQyRd6Sx0uk/FU7ZvSma1sEG2AxRL9BjnR9KwNZzAYBuysWnbUb96pVzNvmjayeth0TIB3xpT4lFGTd5B0ywMqvoIXMAkxZ7MHChURxCaPeQxsBYQkJ91wa6uEcv5XbBSzvA5JcWyQqBgqGJMEYxpW0bLPeV67gJBHHvA+EVMx0nAOjpkzRCpf6IWmKR9gbC4YfrF8/GwHGT83J6hyFJO3Vbc2h5WuT6DON3BwG177APzOLvzm2+28fpKkRclX5vLiS1bN48tt87dHBbDTBNnFuTht/IvVyfNJs71Qeh6BFAeghUIguPDAZkiVwQ6Np1oja2CFWf7biEp88AP6HDrJXcNCEggIBx/yKekcfUM/y+ABxA8QDEQ/xh9Kd+Cg0DMjh3LVweKQBArZcbOkOkv1oqs2CZMuGpulVfC6+V1gumBDaM+MV+23m0t90f2m2zeTOg5j+NuYTa3rBEWzzQYc36yUz3b6hXL4dKYECLezc11C7iEQo8N2InbnNjNaGh3qyuTbdONv4VTZBaPX0Mw9QjCriOnFvbMNPiLVIFepG0nKS91Ncvo2kEhN+KufY5k7onedwkaKU6RX8osYUG+ZdrpGcq0fBVX5HrrAFETMsszxiWnF9af1S782mZy2DSDasv0y1t8EyNuKUdFGGdrXdPtxXFvd1R8ZZjb6xB6GKfReCvZKxwGXoL9/OLToXmAHwspuBu120VSdFnFdeOws3x0KTibxuHJUVYWO5kdDAq8ahR1TTtc5RvTOpHlOksDDqblyFIeYGbMDmHYYiQZaXxZgZ0oWO9Be2Gl6VgwzU+AInBgVg4ww+xlNsIfph6MI7rdUxkKl0TiXUXA4hVmXNg+5QMzIqgbc0xYbAZh1o6qaL0dddM0issieGVzr3ihqEb9KA2HcT8e9jvjsYI8c40fET3zpBtCT16XsxwInxE4Z5bjlajTYg+8VcV5e1yGabddLR9pJw8uAVAW2C6/9qkGAMVOsHSAPcQSbYKpFsuFFvFLm5kq1sEaKrFtRK/MTjUyD8QnHOG1KApxNPziygHlgkOh5ExLU7D8ywRlNf/1MUNcbjDEvw3MZnHNbNst2JmJm6CFyYUjt8PIzEU0YxSV8kuPTtpiAgjtZDIxr2yPzbeH47IPUNRLxvGgmOyW/Lrv5X5xEVBYFggUJT8VuJt9cF74sbPhs4OT8bHVdpztpEnZitKqyNJR2KHLvLXStkc63fgkG4UncXBHcGhtfnUajJkcCnwIyykcDgvIUELhE7TEExAVILRhkRyyi21wjtqBk1/QZoNSbW6A4gIzNiGDEaCOYMqANdqAr50jzIu1WZgRmzHLsOUcVnGrnSYxM2IaVHGaRCXx15APp1u7g+LmbhGwy5NMOtWIhUKaRZMyS1ez/ObOuDjfe6U4+6kXqiYoEsMzRtdK9T2RsFtdmxME1CvshLWiI9kgLpOj+K9xMkiX2DfN8Pou/O4tLUWraWqO2Tg5himth3GwAjTdibUpWOEl8TtEMXxUYHAD1uZst9RBnDvXw6SzfCcqM8WFlS2rQMGbKVhUFbENmU2qElRZj5RsmCZFWtqSl7WsndDgIC+q3UkW7k7G5QCKTbRQ7ZTtMmztEee28yjfLLfTHrMmv+Tb3S0vmOvVpQWr61lgHDpNgAzB3/k1GNRaDc1rCIDKhM0fQpuC8QmjxPQmCTQmug1ZMKJDC7CSkE8KtmfTpIcdY33VEgFjJwyqNgi1wohQiRANSwJoN3HDN1oQNFoe0lCML2HnhonAjthVGGJSAxg3AII9Qog9vgEOh5NqHBZVNg4JEcb4I5DoBR12oqFfxxKIlWUYQZsJXx213/XiuHIO9tYLlZt9Nja8l/O51/8QY/YfTC9uAweLBNKFx48Hl07xSfXq0cic4rPGNiClcWS6I4CCXSkg5fpModhCgDGTuHVQXpuNrmU+Vvd8VNPcEuj3aFqIk8QtFMPHEMEoyiUWKlCc2QBgtERgPmIzvl2VywPey3Ztn9hrjf2ZW+NNFFwFoKIyK4TZMfvRW5l1zHiOH3NrKr4NRt2b6/Tw6bbih5/NK7n9voDSLxM+dTY0D7L/+gg/TM0AquDnaSXWs6zthAGsh2klH5ziHqtfAAEqszd2XoZfLeCy+EY1m7SMiNgnZp3nmDDqV6bbBSRMsS/j1JIA5Qcov0tQts4BAObUyJ5/1phnH+R7+D4QanwxM2a79veHhfJP7i2f1megNj7kGGVglKsqVk0AZYuvjo9Q0iO/Nf1OhFG5d/rTXDfa6VfCeFw+xJBY35s1lB+geJ/jAZS/xeb6VRQ/BwMIxFwSE5Q23Km+1qX49yrTVLFXWftwtbo9semu6Qm5lDsnr7wzgQ+i5MJmXzUAiwT4P8BONdxrEwG1AAAAAElFTkSuQmCC"
                  />
                </el-image>
              </template>

              <p class="ds-text" :style="itemTextStyle">{{ item.name }}</p>
              <template v-if="item.valueShowType === 'img'">
                <el-image
                  v-if="item.valueShowPosition === 'after' && item.valueImgObj && item.valueImgObj.defaultValue"
                  :src="handleImgSrcStr(item.valueImgObj.defaultValue)"
                  :style="getImgStyle(item.valueImgObj)"
                  class="show-img after"
                >
                  <img
                    slot="error"
                    style="width: 100%; height: 100%"
                    src="data:image/png;base64,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"
                  />
                </el-image>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="ds-next" @click="next" slot-name="rightArrow" v-show="isSlideable" :style="arrowStyle">
        <slot name="rightArrow">
          <DsfIcon name="nav_arrow_right"></DsfIcon>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { createCommonTextStyle, createMenuItem } from "_dataview/output/config/commonConfig";
import { eventTemp } from "_dataview/output/utils/relativeEvent";

import mouseEvents from "_dataview/mixins/mouseEvents.js";
import menuMixin from "_dataview/mixins/menuMixin.js";
const defaultBackground = {
  active: "pattern",
  imageType: "nav",
};
const staticData = [
  {
    name: "教学培训",
  },
  {
    name: "学员管理",
  },
  {
    name: "科研成果",
  },
  {
    name: "后勤管理",
  },
  {
    name: "教学管理",
  },
];
const _privateRecurse = function (data) {
  const res = [];
  data.forEach((it) => {
    res.push(
      dsf.mix(
        true,
        {},
        it,
        createMenuItem({
          valueImgObj: {
            defaultValue: "/dataview/file/sdk/download?files=8868369ac62e4d7aa53939c17ebd7387",
            imgWidth: "60",
            imgHeight: "auto",
            ruleList: [],
          },
          valueShowType: "img",
          valueShowPosition: "before",
        })
      )
    );
  });
  return res;
};
export default dsf.component({
  name: "DsfDataViewSlideNavMenu",
  ctrlCaption: "滑动导航菜单",
  mixins: [$mixins.dataView, menuMixin, mouseEvents],
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewSlideNavMenu",
    },
    arrowStyle: {
      type: Object,
      default() {
        return {
          color: "white",
        };
      },
    },
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          //组件初始化事件
          mounted: {
            relatives: [],
            fn: eventTemp,
          },
          //数据点击事件
          click: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移入事件
          mouseenter: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移出事件
          mouseleave: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
    navAlign: {
      type: Object,
      default: () => ({
        vAlign: "center",
        hAlign: "center",
      }),
    },
    textAlign: {
      type: Object,
      default: () => ({
        hAlign: "center",
      }),
    },
    textStyle: {
      type: Object,
      default: () => createCommonTextStyle(),
    },
    staticData: {
      type: Array,
      default: () => _privateRecurse(staticData),
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "150px",
    },
    itemWidth: {
      type: Number,
      default: 100,
    },
    itemHeight: {
      type: String,
      default: "100%",
    },
    itemGap: {
      type: Number,
      default: 20,
    },
    // 垂直缩进
    itemIndentY: {
      type: Number,
      default: 0,
    },
    showCount: {
      type: Number,
      default: 4,
    },
    iconPadding: {
      type: Array,
      default: () => [0, 0, 10, 0],
    },
    textPadding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    itemBackgroundConfig: {
      type: Object,
      default() {
        return {
          ...defaultBackground,
        };
      },
    },
    panelBackgroundConfig: {
      type: Object,
      default() {
        return {
          ...defaultBackground,
        };
      },
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "default",
            controls: [],
          },
          {
            name: "leftArrow",
            controls: [],
          },
          {
            name: "rightArrow",
            controls: [],
          },
        ];
      },
    },
  },

  computed: {
    isSlideable() {
      return this.showItems.length > this.showCount;
    },
    // 计算克隆后的项目数组（首尾各添加一个项目实现无缝连接）
    computedClonedItems() {
      const showItems = this.showItems;
      if (showItems.length === 0) return [];
      const end = { ...showItems[showItems.length - 1], virtualId: dsf.uuid() };
      const first = { ...showItems[0], virtualId: dsf.uuid() };
      return [
        end, // 最后一个项目放在前面
        ...showItems,
        first, // 第一个项目放在后面
      ];
    },

    rootStyle() {
      return {
        width: this.width,
        height: this.isDesign ? "100%" : this.height,
        margin: dsf.dataview.utils.transformArrayPx(this.margin),
        padding: dsf.dataview.utils.transformArrayPx(this.padding),
        ...this.dvBackgroundFormat(this.panelBackgroundConfig, {
          isBgInfoVar: true,
        }),
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
    },
    rootInnerStyle() {
      return {
        justifyContent: this.navAlign.hAlign,
      };
    },
    containerStyle() {
      const w = this.showCount * (this.itemWidth + this.itemGap) + this.itemGap;
      return {
        width: w + "px",
        overflow: "hidden",
      };
    },
    getItemStyle() {
      let len = this.showCount;
      let mid = len % 2 ? Math.floor(len / 2) : (len - 1) / 2;

      return function (idx, item) {
        let delta = idx - mid;
        let realDelta = Math.floor(Math.abs(delta));
        let offsetX = delta * (this.itemWidth + this.itemGap);
        let offsetY = Math.floor(Math.abs(idx - 1 - mid)) * this.itemIndentY;
        let style = {
          textAlign: this.textAlign.hAlign,
          height: !this.itemIndentY ? this.itemHeight : `calc(${this.itemHeight} - ${this.itemIndentY * mid}px)`,
          left: `calc(50% - ${this.itemWidth / 2}px)`,
          width: this.itemWidth + "px",
          lineHeight: dsf.dataview.utils.transformPx(this.textStyle.fontSize),
          opacity: 1 - realDelta / 20,
          marginLeft: `${offsetX}px`,
          transform: `translateY(${offsetY}px)`,
          overflow: "show",
          ...this.dvBackgroundFormat(this.itemBackgroundConfig, {
            isBgInfoVar: true,
          }),
        };
        if (item.interactType !== "-1" || dsf.dataview.utils.isCursorPointer([this.eventRelativeDeal.click])) {
          style["cursor"] = "pointer";
        }
        return style;
      };
    },
    itemTextStyle() {
      const textStyle = dsf.dataview.utils.transformTextStyle(this.textStyle);
      return {
        padding: dsf.dataview.utils.transformArrayPx(this.textPadding),
        ...textStyle,
      };
    },
  },
  data() {
    return {
      data: [],
      showItems: [],
      transitonType: 1,
      otherEvents: ["添加菜单", "隐藏菜单", "显示菜单", "更新菜单"],
      componentType: "navMenu",
    };
  },
  created() {
    this.data = dsf.mix(true, [], this.staticData);
    this.showItems = this.data.filter((it) => !this.isHide(it));
  },
  mounted() {
    this.$nextTick(() => {
      this.handleEventScope();
      //触发初始化完成
      this.loadMountedEvents();

      const element = $(this.$el).find(".ds-slide-container")[0];
      const translateX = this.itemWidth + this.itemGap;
      element.style.transform = `translateX(${-translateX}px)`;
    });
  },
  watch: {
    staticData: {
      handler(staticData) {
        if (this.isDesign) {
          this.data = dsf.mix(true, [], staticData);
        }
      },
      deep: true,
    },
    data: {
      handler() {
        console.log(111);
        this.showItems = this.data
          .filter((it) => !this.isHide(it))
          .map((it) => {
            return {
              ...it,
              virtualId: dsf.uuid(),
            };
          });
      },
      deep: true,
    },
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.textStyle],
        textAligns: [this.textAlign],
        backgrounds: [this.panelBackgroundConfig],
        itemBackgrounds: [this.itemBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter((it) => /布局|背景|边框设置|入场动画/.test(it.name));
        const { textStyles = [], textAligns = [], backgrounds = [], itemBackgrounds = [] } = config;
        this.updateComponentStyle("textStyle", textStyles[0]);
        this.updateComponentStyle("textAlign", textAligns[0]);
        this.updateComponentStyle("panelBackgroundConfig", backgrounds[0]);
        this.updateComponentStyle("itemBackgroundConfig", itemBackgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    //初始化事件
    loadMountedEvents() {
      try {
        let { mounted } = this.eventRelativeDeal;
        if (mounted && mounted.fn) {
          const fn = mounted.fn;
          this.currentComponentData = this.staticData;
          this.handleCommonEmit(fn, this.currentComponentData);
        }
      } catch (e) {
        console.error(e);
      }
    },
    //点击依赖组件关联方法
    loadClickEvents(data, evt) {
      try {
        let { fn } = this.eventRelativeDeal.click;
        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data, evt);
      } catch (e) {
        console.error(e);
      }
    },

    /**
     * @Description 添加菜单伪代码
     * @param {*} menu 菜单对象或数组
     */
    handleAddMenu(menu) {
      const data = this.data;
      if (Array.isArray(menu)) {
        data.push(...menu);
      } else {
        data.push(menu);
      }
    },

    /**
     * @Description 隐藏菜单伪代码码
     * @param {*} id 菜单id或者数组
     */
    handleHiddenMenu(id) {
      if (Array.isArray(id)) {
        this.data.forEach((it) => {
          if (id.includes(it.id)) {
            it.isHide = "true";
          }
        });
      } else {
        this.data.forEach((it) => {
          if (id == it.id) {
            it.isHide = "true";
          }
        });
      }
    },
    /**
     * @Description 显示菜单伪代码码
     * @param {*} id 菜单id或者数组
     */
    handleShowMenu(id) {
      if (Array.isArray(id)) {
        this.data.forEach((it) => {
          if (id.includes(it.id)) {
            it.isHide = "false";
          }
        });
      } else {
        this.data.forEach((it) => {
          if (id == it.id) {
            it.isHide = "false";
          }
        });
      }
    },
    //更新菜单
    handleUpdateMenu(data) {
      this.data = data;
    },
    clickItem(evt, item, index) {
      this.$dispatch("clickItem", item);
      this.loadClickEvents(item, evt);
      this.commonLink(item);
    },
    isHide(tab) {
      if (!this.isDesign) {
        let v = this.$expressParams();
        return this.$eval(tab.isHide, v);
      }
      return false;
    },
    prev() {
      const translateX = this.itemWidth + this.itemGap;
      const element = $(this.$el).find(".ds-slide-container")[0];

      element.style.transition = "all 0.3s ease-in-out";
      element.style.transform = `translateX(0)`;

      element.addEventListener(
        "transitionend",
        () => {
          this.showItems.unshift(this.showItems.pop());

          element.style.transition = "none";

          element.style.transform = `translateX(${-translateX}px)`;
        },
        { once: true }
      );
    },
    next() {
      const translateX = this.itemWidth + this.itemGap;
      const element = $(this.$el).find(".ds-slide-container")[0];

      element.style.transition = "all 0.3s ease-in-out";
      element.style.transform = `translateX(-${translateX * 2}px)`;

      element.addEventListener(
        "transitionend",
        () => {
          this.showItems.push(this.showItems.shift());
          element.style.transition = "none";

          element.style.transform = `translateX(${-translateX}px)`;
        },
        { once: true }
      );
    },
    getImgStyle(obj) {
      return {
        width: dsf.dataview.utils.transformPx(obj.imgWidth),
        height: dsf.dataview.utils.transformPx(obj.imgHeight),
        padding: dsf.dataview.utils.transformArrayPx(this.iconPadding),
        ...dsf.dataview.utils.getBgAnimation(obj.defaultValue),
      };
    },
  },
});
</script>

<style lang="scss">
@import "_dataview/assets/styles/share/components/slideNavMenu.scss";
</style>
