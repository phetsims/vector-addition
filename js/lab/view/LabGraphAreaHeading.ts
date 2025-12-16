// Copyright 2025, University of Colorado Boulder

/**
 * LabGraphAreaHeading is a 'Graph Area' heading for the Lab screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ExploreGraphAreaHeading from '../../common/view/ExploreGraphAreaHeading.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import LabVectorSet from '../model/LabVectorSet.js';

export default class LabGraphAreaHeading extends Node {

  public constructor( graphNode: Node,
                      vectorSetNodesParent: Node,
                      visibleProperty: TReadOnlyProperty<boolean>,
                      sum1VisibleProperty: TReadOnlyProperty<boolean>,
                      sum2VisibleProperty: TReadOnlyProperty<boolean>,
                      vectorSet1: LabVectorSet,
                      vectorSet2: LabVectorSet ) {
    super( {
      visibleProperty: visibleProperty,
      pdomOrder: [
        graphNode,
        vectorSetNodesParent
      ],
      accessibleHeading: VectorAdditionStrings.a11y.accessibleHeadings.graphAreaHeadingStringProperty,
      accessibleParagraph: new PatternStringProperty( VectorAdditionStrings.a11y.graphArea.accessibleParagraphLabStringProperty, {
        vectorSet1Size: ExploreGraphAreaHeading.createTotalNumberOfVectorsProperty( sum1VisibleProperty, vectorSet1 ),
        vectorSet1Symbol: vectorSet1.accessibleSymbolProperty,
        vectorSet2Size: ExploreGraphAreaHeading.createTotalNumberOfVectorsProperty( sum2VisibleProperty, vectorSet2 ),
        vectorSet2Symbol: vectorSet2.accessibleSymbolProperty
      } )
    } );
  }
}

vectorAddition.register( 'LabGraphAreaHeading', LabGraphAreaHeading );