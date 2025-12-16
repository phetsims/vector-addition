// Copyright 2025, University of Colorado Boulder

/**
 * ExploreGraphAreaHeading is a 'Graph Area' heading for the Explore 1D and Explore 2D screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorSet from '../model/VectorSet.js';

export default class ExploreGraphAreaHeading extends Node {

  public constructor( graphNode: Node, vectorSetNodesParent: Node, visibleProperty: TReadOnlyProperty<boolean>,
                      sumVisibleProperty: TReadOnlyProperty<boolean>, vectorSet: VectorSet ) {
    super( {
      visibleProperty: visibleProperty,
      pdomOrder: [
        graphNode,
        vectorSetNodesParent
      ],
      accessibleHeading: VectorAdditionStrings.a11y.accessibleHeadings.graphAreaHeadingStringProperty,
      accessibleParagraph: new PatternStringProperty( VectorAdditionStrings.a11y.graphArea.accessibleParagraphExploreStringProperty, {
        numberOfVectors: ExploreGraphAreaHeading.createTotalNumberOfVectorsProperty( sumVisibleProperty, vectorSet )
      } )
    } );
  }

  /**
   * Creates a Property that indicates the total number of vectors on the graph for a specified vector set,
   * including the sum vector if it is visible and defined.
   */
  public static createTotalNumberOfVectorsProperty(
    sumVisibleProperty: TReadOnlyProperty<boolean>,
    vectorSet: VectorSet ): TReadOnlyProperty<number> {
    return new DerivedProperty(
      [ sumVisibleProperty, vectorSet.resultantVector.isDefinedProperty, vectorSet.numberOfVectorsOnGraphProperty ],
      ( sumVisible, sumIsDefined, numberOfVectorsOnGraph ) =>
        ( sumVisible && sumIsDefined ) ? numberOfVectorsOnGraph + 1 : numberOfVectorsOnGraph );
  }
}

vectorAddition.register( 'ExploreGraphAreaHeading', ExploreGraphAreaHeading );