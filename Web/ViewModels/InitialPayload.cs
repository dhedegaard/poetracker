using Core.Models;
using System.Collections.Generic;
using Web.ViewModels;

namespace Web.ViewModels {
    public class InitialPayload {
        public IEnumerable<League> Leagues { get; set; }
        public IEnumerable<DatapointResult> LatestDatapoints { get; set; }
        public IEnumerable<Account> Accounts { get; set; }
    }
}
