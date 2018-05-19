using Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Web.Models {
    public class InitialPayload {
        public IList<League> Leagues { get; set; }
        public IList<Datapoint> LatestDatapoints { get; set; }
    }
}
